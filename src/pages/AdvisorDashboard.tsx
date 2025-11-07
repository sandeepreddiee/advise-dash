import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, AlertTriangle, TrendingUp, UserCheck, LogOut } from "lucide-react";
import { toast } from "sonner";

interface StudentData {
  student_id: string;
  name: string;
  major: string;
  cumulative_gpa: number;
  risk_tier: "Low" | "Medium" | "High";
  risk_score: number;
  attendance_pct?: number;
}

export default function AdvisorDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    avgGPA: "0.00",
    avgAttendance: "0%",
  });

  useEffect(() => {
    checkAuth();
    loadStudents();
  }, []);

  const checkAuth = async () => {
    console.log("AdvisorDashboard: Checking authentication...");
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log("AdvisorDashboard: No session, redirecting to auth");
      navigate("/auth");
      return;
    }

    console.log("AdvisorDashboard: Session found for user:", session.user.id);

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    console.log("AdvisorDashboard: User role:", roles?.role);

    if (rolesError) {
      console.error("AdvisorDashboard: Error fetching role:", rolesError);
      toast.error("Failed to verify user role");
      setLoading(false);
      return;
    }

    if (roles?.role !== "advisor") {
      console.log("AdvisorDashboard: User is not an advisor, redirecting to student");
      navigate("/student");
    }
  };

  const loadStudents = async () => {
    try {
      console.log("AdvisorDashboard: Loading students...");
      
      // Load students with risk scores
      const { data: studentsData, error: studentsError } = await supabase
        .from("students")
        .select(`
          student_id,
          name,
          major,
          cumulative_gpa,
          risk_scores (
            risk_tier,
            risk_score
          )
        `)
        .order("name");

      console.log("AdvisorDashboard: Students loaded:", studentsData?.length);

      if (studentsError) {
        console.error("AdvisorDashboard: Error loading students:", studentsError);
        throw studentsError;
      }

      // Load attendance data
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("student_id, attendance_pct")
        .order("created_at", { ascending: false });

      // Process data
      const processedStudents = (studentsData || []).map((s: any) => ({
        student_id: s.student_id,
        name: s.name,
        major: s.major || "Undeclared",
        cumulative_gpa: s.cumulative_gpa || 0,
        risk_tier: s.risk_scores?.[0]?.risk_tier || "Low",
        risk_score: s.risk_scores?.[0]?.risk_score || 0,
        attendance_pct: attendanceData?.find(a => a.student_id === s.student_id)?.attendance_pct || 0,
      }));

      setStudents(processedStudents);

      // Calculate stats
      const total = processedStudents.length;
      const highRisk = processedStudents.filter(s => s.risk_tier === "High").length;
      const avgGPA = total > 0
        ? (processedStudents.reduce((sum, s) => sum + s.cumulative_gpa, 0) / total).toFixed(2)
        : "0.00";
      const avgAttendance = total > 0
        ? Math.round(processedStudents.reduce((sum, s) => sum + (s.attendance_pct || 0), 0) / total) + "%"
        : "0%";

      setStats({ total, highRisk, avgGPA, avgAttendance });
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

  const handleStudentClick = (studentId: string) => {
    navigate(`/advisor/student/${studentId}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar role="advisor" />
        
        <main className="flex-1">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">Advisor Dashboard</h1>
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
                title="Total Students Assigned"
                value={stats.total}
                icon={Users}
              />
              <StatCard
                title="High-Risk Students"
                value={stats.highRisk}
                icon={AlertTriangle}
              />
              <StatCard
                title="Average Term GPA"
                value={stats.avgGPA}
                icon={TrendingUp}
              />
              <StatCard
                title="Average Attendance"
                value={stats.avgAttendance}
                icon={UserCheck}
              />
            </div>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No students assigned</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Major</TableHead>
                        <TableHead>Risk Tier</TableHead>
                        <TableHead className="text-right">Risk Score</TableHead>
                        <TableHead className="text-right">Term GPA</TableHead>
                        <TableHead className="text-right">Attendance %</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow 
                          key={student.student_id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleStudentClick(student.student_id)}
                        >
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.major}</TableCell>
                          <TableCell>
                            <RiskBadge tier={student.risk_tier} />
                          </TableCell>
                          <TableCell className="text-right">{student.risk_score.toFixed(0)}</TableCell>
                          <TableCell className="text-right">{student.cumulative_gpa.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{student.attendance_pct?.toFixed(0) || 0}%</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
