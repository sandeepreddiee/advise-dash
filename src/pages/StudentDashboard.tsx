import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, UserCheck, BookOpen, LogOut } from "lucide-react";
import { toast } from "sonner";

interface StudentStats {
  gpa: number;
  attendance: number;
  engagement: number;
  riskTier: "Low" | "Medium" | "High";
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [stats, setStats] = useState<StudentStats>({
    gpa: 0,
    attendance: 0,
    engagement: 0,
    riskTier: "Low",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log("StudentDashboard: Checking authentication...");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("StudentDashboard: No session found, redirecting to auth");
      navigate("/auth");
      return;
    }

    console.log("StudentDashboard: Session found for user:", session.user.id);

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    console.log("StudentDashboard: User role:", roles?.role);

    if (rolesError) {
      console.error("StudentDashboard: Error fetching role:", rolesError);
      toast.error("Failed to verify user role");
      setLoading(false);
      return;
    }

    if (roles?.role !== "student") {
      console.log("StudentDashboard: User is not a student, redirecting to advisor");
      navigate("/advisor");
      return;
    }

    loadStudentData(session.user.id);
  };

  const loadStudentData = async (userId: string) => {
    try {
      console.log("StudentDashboard: Loading data for user:", userId);
      
      // Get profile and student data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, student_id")
        .eq("id", userId)
        .single();

      console.log("StudentDashboard: Profile data:", profile);

      if (profileError) {
        console.error("StudentDashboard: Profile error:", profileError);
        throw profileError;
      }

      if (profile) {
        setStudentName(profile.full_name || "Student");

        // Check if student is linked to a student record
        if (!profile.student_id) {
          console.log("StudentDashboard: No student_id linked to profile");
          toast.error("Your account is not linked to a student record yet. Please contact your advisor.");
          setLoading(false);
          return;
        }

        console.log("StudentDashboard: Loading data for student_id:", profile.student_id);

        // Load student academic data
        const { data: student, error: studentError } = await supabase
          .from("students")
          .select(`
            cumulative_gpa,
            risk_scores (risk_tier)
          `)
          .eq("student_id", profile.student_id)
          .single();

        console.log("StudentDashboard: Student data:", student);

        if (studentError) {
          console.error("StudentDashboard: Student data error:", studentError);
        }

        // Load attendance
        const { data: attendance, error: attendanceError } = await supabase
          .from("attendance")
          .select("attendance_pct")
          .eq("student_id", profile.student_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        console.log("StudentDashboard: Attendance data:", attendance);

        if (attendanceError) {
          console.error("StudentDashboard: Attendance error:", attendanceError);
        }

        // Load LMS engagement
        const { data: lmsData, error: lmsError } = await supabase
          .from("lms_events")
          .select("logins, time_on_platform_min")
          .eq("student_id", profile.student_id)
          .order("created_at", { ascending: false })
          .limit(10);

        console.log("StudentDashboard: LMS data:", lmsData);

        if (lmsError) {
          console.error("StudentDashboard: LMS error:", lmsError);
        }

        const avgEngagement = lmsData && lmsData.length > 0
          ? Math.round(lmsData.reduce((sum, e) => sum + (e.logins || 0), 0) / lmsData.length * 10)
          : 0;

        setStats({
          gpa: student?.cumulative_gpa || 0,
          attendance: attendance?.attendance_pct || 0,
          engagement: avgEngagement,
          riskTier: student?.risk_scores?.[0]?.risk_tier || "Low",
        });
      }
    } catch (error: any) {
      console.error("StudentDashboard: Error loading data:", error);
      toast.error("Failed to load student data: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="student" />
        
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Welcome, {studentName}!</h1>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading your dashboard...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Current Term GPA"
                value={stats.gpa.toFixed(2)}
                icon={TrendingUp}
              />
              <StatCard
                title="Attendance %"
                value={`${stats.attendance.toFixed(0)}%`}
                icon={UserCheck}
              />
              <StatCard
                title="Engagement Score"
                value={stats.engagement}
                icon={BookOpen}
              />
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Risk Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskBadge tier={stats.riskTier} className="text-base px-3 py-1" />
                </CardContent>
              </Card>
            </div>

            {/* Recommendations Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions for You</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {stats.riskTier === "High" ? (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Schedule a meeting with your academic advisor</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Visit the tutoring center for additional support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Review study strategies and time management resources</span>
                      </li>
                    </>
                  ) : stats.riskTier === "Medium" ? (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Stay consistent with your study schedule</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Complete all pending course assignments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Attend all scheduled classes</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Keep up the great work!</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Consider joining honors programs or research opportunities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>Explore leadership positions in student organizations</span>
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
