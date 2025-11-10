import { useParams, useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, User, TrendingUp, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { getStudentById, getInterventionsForStudent, getGpaTrendForStudent } from "@/data/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function StudentDetail() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const student = getStudentById(studentId || "");
  const interventions = getInterventionsForStudent(studentId || "");
  const gpaTrend = getGpaTrendForStudent(studentId || "");

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading">Student not found</h2>
          <Button onClick={() => navigate("/advisor")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/advisor")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl text-primary">Horizon University</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6 flex-1">
        {/* Student Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold">{student.name}</h1>
          <p className="text-muted-foreground text-lg">{student.major} - Year {student.year}</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="attendance">Attendance & LMS</TabsTrigger>
            <TabsTrigger value="interventions">Interventions & Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Risk Tier</CardTitle>
                </CardHeader>
                <CardContent>
                  <RiskBadge tier={student.riskTier} className="text-base" />
                </CardContent>
              </Card>
              <StatCard title="Current Term GPA" value={student.termGpa.toFixed(2)} />
              <StatCard title="Attendance %" value={`${student.attendance}%`} />
              <StatCard title="LMS Engagement" value={`${student.lmsEngagement}%`} />
            </div>

            {/* GPA Trend Chart */}
            {gpaTrend.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>GPA Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={gpaTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="term" />
                      <YAxis domain={[0, 4.0]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="gpa" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {student.riskTier === "High" && 
                    `${student.name} shows signs of academic difficulty with a current GPA of ${student.termGpa.toFixed(2)}. Attendance is at ${student.attendance}% and LMS engagement is ${student.lmsEngagement}%. Immediate intervention recommended.`
                  }
                  {student.riskTier === "Medium" && 
                    `${student.name} is performing adequately but showing some warning signs. Current GPA is ${student.termGpa.toFixed(2)} with ${student.attendance}% attendance. Regular monitoring advised.`
                  }
                  {student.riskTier === "Low" && 
                    `${student.name} is performing well academically with a GPA of ${student.termGpa.toFixed(2)} and ${student.attendance}% attendance. Continue current support level.`
                  }
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Current Term GPA</span>
                  <span className="text-2xl font-heading">{student.termGpa.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Risk Score</span>
                  <span className="text-2xl font-heading">{student.riskScore}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                  <span className="font-medium">Assignment Completion (Term)</span>
                  <span className="text-2xl font-heading">
                    {student.riskTier === "High" ? "65%" : student.riskTier === "Medium" ? "78%" : "95%"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading mb-2">{student.attendance}%</div>
                  <p className="text-sm text-muted-foreground">Current term attendance</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>LMS Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-heading mb-2">{student.lmsEngagement}%</div>
                  <p className="text-sm text-muted-foreground">Platform activity level</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            {/* Intervention History */}
            <Card>
              <CardHeader>
                <CardTitle>Intervention History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {interventions.length > 0 ? (
                      interventions.map((intervention) => (
                        <TableRow key={intervention.id}>
                          <TableCell>{new Date(intervention.date).toLocaleDateString()}</TableCell>
                          <TableCell>{intervention.type}</TableCell>
                          <TableCell>{intervention.notes}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          No interventions recorded
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Add Note */}
            <Card>
              <CardHeader>
                <CardTitle>Add Note</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="note-type">Meeting Type</Label>
                  <select id="note-type" className="w-full mt-2 p-2 border rounded-md">
                    <option>Advising Session</option>
                    <option>Email Check-in</option>
                    <option>Tutoring Referral</option>
                    <option>Mental Health Referral</option>
                    <option>Academic Warning</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="note-text">Note</Label>
                  <Textarea 
                    id="note-text" 
                    placeholder="Enter intervention notes..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <Button>Save Note</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
