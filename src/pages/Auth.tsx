import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupRole, setSignupRole] = useState<"advisor" | "student">("student");

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkRoleAndRedirect(session.user.id);
      }
    });
  }, []);

  const checkRoleAndRedirect = async (userId: string) => {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();

    console.log("Auth: User role is:", roles?.role);

    if (roles?.role === "advisor") {
      navigate("/advisor");
    } else {
      navigate("/student");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.user) {
        console.log("Login successful for user:", data.user.id);
        await checkRoleAndRedirect(data.user.id);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: signupName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        console.log("Signup successful for user:", data.user.id, "Role:", signupRole);
        
        // Insert role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: signupRole,
        });

        if (roleError) {
          console.error("Error inserting role:", roleError);
          throw roleError;
        }

        console.log("Role inserted successfully:", signupRole);

        // If signing up as a student, create mock student record
        if (signupRole === "student") {
          console.log("Creating mock student record...");
          
          // Create student record
          const { data: studentData, error: studentError } = await supabase
            .from("students")
            .insert({
              name: signupName,
              major: "Computer Science",
              cumulative_gpa: 3.2 + Math.random() * 0.8, // Random GPA between 3.2-4.0
              age: 19 + Math.floor(Math.random() * 4), // Age 19-22
              gender: "Not specified",
              first_gen: Math.random() > 0.5,
              credits_completed: 30 + Math.floor(Math.random() * 60),
            })
            .select()
            .single();

          if (studentError) {
            console.error("Error creating student:", studentError);
            throw studentError;
          }

          console.log("Student record created:", studentData.student_id);

          // Link student to profile
          const { error: profileUpdateError } = await supabase
            .from("profiles")
            .update({ student_id: studentData.student_id })
            .eq("id", data.user.id);

          if (profileUpdateError) {
            console.error("Error linking profile:", profileUpdateError);
            throw profileUpdateError;
          }

          // Create current term if it doesn't exist
          let termId;
          const { data: existingTerm } = await supabase
            .from("terms")
            .select("term_id")
            .eq("term_name", "Fall 2025")
            .single();

          if (existingTerm) {
            termId = existingTerm.term_id;
          } else {
            const { data: newTerm } = await supabase
              .from("terms")
              .insert({
                term_name: "Fall 2025",
                start_date: "2025-09-01",
                weeks: 16,
              })
              .select()
              .single();
            termId = newTerm?.term_id;
          }

          // Create sample course
          let courseId;
          const { data: existingCourse } = await supabase
            .from("courses")
            .select("course_id")
            .eq("dept", "CS")
            .eq("level", 101)
            .single();

          if (existingCourse) {
            courseId = existingCourse.course_id;
          } else {
            const { data: newCourse } = await supabase
              .from("courses")
              .insert({
                dept: "CS",
                level: 101,
                title: "Introduction to Programming",
              })
              .select()
              .single();
            courseId = newCourse?.course_id;
          }

          // Create mock data
          const gpa = studentData.cumulative_gpa;
          const isHighRisk = gpa < 2.8;
          const isMediumRisk = gpa >= 2.8 && gpa < 3.3;

          // Risk score
          await supabase.from("risk_scores").insert({
            student_id: studentData.student_id,
            term_id: termId,
            risk_score: isHighRisk ? 75 : (isMediumRisk ? 50 : 20),
            risk_tier: isHighRisk ? "High" : (isMediumRisk ? "Medium" : "Low"),
            intervention_type: isHighRisk ? "Academic counseling recommended" : "Regular check-in",
          });

          // Attendance
          await supabase.from("attendance").insert({
            student_id: studentData.student_id,
            course_id: courseId,
            term_id: termId,
            month: "November",
            attendance_pct: isHighRisk ? 75 : (isMediumRisk ? 85 : 95),
          });

          // LMS events
          for (let i = 0; i < 5; i++) {
            await supabase.from("lms_events").insert({
              student_id: studentData.student_id,
              course_id: courseId,
              term_id: termId,
              grain: "weekly",
              date: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              logins: isHighRisk ? Math.floor(2 + Math.random() * 3) : Math.floor(8 + Math.random() * 7),
              time_on_platform_min: isHighRisk ? Math.floor(30 + Math.random() * 40) : Math.floor(90 + Math.random() * 90),
              assignments_submitted: Math.floor(Math.random() * 3),
            });
          }

          // Financial aid
          await supabase.from("financial_aid").insert({
            student_id: studentData.student_id,
            household_income_usd: 40000 + Math.floor(Math.random() * 80000),
            scholarship_flag: Math.random() > 0.5,
            aid_amount_usd: Math.floor(5000 + Math.random() * 15000),
            work_hours_per_week: Math.floor(Math.random() * 20),
          });

          console.log("Mock data created successfully");
        }

        toast.success("Account created successfully!");
        
        // Direct navigation based on signup role instead of querying
        console.log("Redirecting to:", signupRole === "advisor" ? "/advisor" : "/student");
        navigate(signupRole === "advisor" ? "/advisor" : "/student");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Horizon University</CardTitle>
          <CardDescription>Student Success & Retention Hub</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@horizon.edu"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@horizon.edu"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label>I am a:</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={signupRole === "student"}
                        onChange={(e) => setSignupRole(e.target.value as "student")}
                        className="text-primary"
                      />
                      <span>Student</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="advisor"
                        checked={signupRole === "advisor"}
                        onChange={(e) => setSignupRole(e.target.value as "advisor")}
                        className="text-primary"
                      />
                      <span>Advisor</span>
                    </label>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
