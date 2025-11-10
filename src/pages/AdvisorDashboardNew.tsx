import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, Users, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { mockStudents } from "@/data/mockData";

export default function AdvisorDashboardNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    totalStudents: mockStudents.length,
    highRiskStudents: mockStudents.filter(s => s.riskTier === "High").length,
    averageGpa: (mockStudents.reduce((sum, s) => sum + s.termGpa, 0) / mockStudents.length).toFixed(2),
    averageAttendance: Math.round(mockStudents.reduce((sum, s) => sum + s.attendance, 0) / mockStudents.length),
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/advisor/student/${studentId}`);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-heading font-bold text-xl text-primary">Horizon University</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 flex-1">
        <h1 className="text-3xl font-heading font-bold mb-6">Advisor Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-2">
              <Users className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="risk-alerts" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Alerts
            </TabsTrigger>
            <TabsTrigger value="interventions" className="gap-2">
              <FileText className="h-4 w-4" />
              Interventions & Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Students Assigned" 
                value={stats.totalStudents}
                icon={Users}
              />
              <StatCard 
                title="High-Risk Students" 
                value={stats.highRiskStudents}
                icon={AlertTriangle}
              />
              <StatCard 
                title="Average Term GPA" 
                value={stats.averageGpa}
              />
              <StatCard 
                title="Average Attendance %" 
                value={`${stats.averageAttendance}%`}
              />
            </div>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Students</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STUDENT NAME</TableHead>
                      <TableHead>MAJOR</TableHead>
                      <TableHead>RISK TIER</TableHead>
                      <TableHead>RISK SCORE</TableHead>
                      <TableHead>TERM GPA</TableHead>
                      <TableHead>ATTENDANCE %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents.slice(0, 20).map((student) => (
                      <TableRow 
                        key={student.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleStudentClick(student.id)}
                      >
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.major}</TableCell>
                        <TableCell>
                          <RiskBadge tier={student.riskTier} />
                        </TableCell>
                        <TableCell>{student.riskScore}</TableCell>
                        <TableCell>{student.termGpa.toFixed(2)}</TableCell>
                        <TableCell>{student.attendance}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>High Risk Students Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>STUDENT NAME</TableHead>
                      <TableHead>MAJOR</TableHead>
                      <TableHead>RISK SCORE</TableHead>
                      <TableHead>TERM GPA</TableHead>
                      <TableHead>ATTENDANCE %</TableHead>
                      <TableHead>LMS ENGAGEMENT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStudents
                      .filter(s => s.riskTier === "High")
                      .map((student) => (
                        <TableRow 
                          key={student.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleStudentClick(student.id)}
                        >
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.major}</TableCell>
                          <TableCell>
                            <RiskBadge tier={student.riskTier} />
                          </TableCell>
                          <TableCell>{student.termGpa.toFixed(2)}</TableCell>
                          <TableCell>{student.attendance}%</TableCell>
                          <TableCell>{student.lmsEngagement}%</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Interventions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Select a student from the Dashboard to view and add intervention notes.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
