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
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roles?.role !== "student") {
      navigate("/advisor");
      return;
    }

    loadStudentData(session.user.id);
  };

  const loadStudentData = async (userId: string) => {
    try {
      // Get profile and student data
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, student_id")
        .eq("id", userId)
        .single();

      if (profile) {
        setStudentName(profile.full_name || "Student");

        if (profile.student_id) {
          // Load student academic data
          const { data: student } = await supabase
            .from("students")
            .select(`
              cumulative_gpa,
              risk_scores (risk_tier)
            `)
            .eq("student_id", profile.student_id)
            .single();

          // Load attendance
          const { data: attendance } = await supabase
            .from("attendance")
            .select("attendance_pct")
            .eq("student_id", profile.student_id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Load LMS engagement
          const { data: lmsData } = await supabase
            .from("lms_events")
            .select("logins, time_on_platform_min")
            .eq("student_id", profile.student_id)
            .order("created_at", { ascending: false })
            .limit(10);

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
      }
    } catch (error: any) {
      toast.error("Failed to load student data");
      console.error(error);
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
