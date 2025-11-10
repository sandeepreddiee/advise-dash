import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, TrendingUp, Calendar, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock student data (Emily Nguyen as example)
const studentData = {
  name: "Emily Nguyen",
  termGpa: 3.90,
  attendance: 98,
  engagement: 92,
  riskTier: "Low" as const,
  gpaTrend: [
    { term: "Term 1", gpa: 3.75 },
    { term: "Term 2", gpa: 3.82 },
    { term: "Term 3", gpa: 3.88 },
    { term: "Term 4", gpa: 3.90 },
  ],
  recommendedActions: [
    "Explore Honors Program requirements",
    "Sign up for the Spring research symposium",
    "Meet advisor to discuss 400-level courses",
    "Complete pending course surveys",
  ],
};

export default function StudentDashboardNew() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");

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
        <h1 className="text-3xl font-heading font-bold mb-2">Welcome, {studentData.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mb-6">Here's your academic progress overview</p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="resources">Resources & Support</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard 
                title="Current Term GPA" 
                value={studentData.termGpa.toFixed(2)}
                icon={TrendingUp}
              />
              <StatCard 
                title="Attendance %" 
                value={`${studentData.attendance}%`}
                icon={Calendar}
              />
              <StatCard 
                title="Engagement Score" 
                value={studentData.engagement}
                icon={BookOpen}
              />
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Risk Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskBadge tier={studentData.riskTier} />
                </CardContent>
              </Card>
            </div>

            {/* GPA Trend */}
            <Card>
              <CardHeader>
                <CardTitle>GPA Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={studentData.gpaTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="term" />
                    <YAxis domain={[0, 4.0]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="gpa" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recommended Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions for You</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {studentData.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Term Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentData.gpaTrend.map((term, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-muted rounded-lg">
                      <span className="font-medium">{term.term}</span>
                      <span className="text-lg font-heading">{term.gpa.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Dean's List - Fall 2025
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Perfect Attendance Award
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Research Excellence Nominee
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-heading font-semibold mb-2">Tutoring Center</h3>
                    <p className="text-sm text-muted-foreground">Free peer tutoring available for all courses</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-heading font-semibold mb-2">Writing Lab</h3>
                    <p className="text-sm text-muted-foreground">Get help with essays and research papers</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-heading font-semibold mb-2">Study Groups</h3>
                    <p className="text-sm text-muted-foreground">Join collaborative study sessions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-heading font-semibold mb-2">Career Services</h3>
                    <p className="text-sm text-muted-foreground">Resume reviews and interview prep</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Counseling & Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-heading font-semibold mb-2">Counseling Center</h3>
                    <p className="text-sm text-muted-foreground mb-2">Mental health and wellness support</p>
                    <Button variant="outline" size="sm">Schedule Appointment</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-heading font-semibold mb-2">Academic Advisor</h3>
                    <p className="text-sm text-muted-foreground mb-2">Meet with your academic advisor</p>
                    <Button variant="outline" size="sm">Contact Advisor</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
