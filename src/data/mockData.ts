// Large mock data for the Horizon Student Success System

export interface Student {
  id: string;
  name: string;
  major: string;
  year: number;
  riskTier: "Low" | "Medium" | "High";
  riskScore: number;
  termGpa: number;
  attendance: number;
  lmsEngagement: number;
  email: string;
}

export interface Intervention {
  id: string;
  studentId: string;
  date: string;
  type: string;
  notes: string;
}

export interface GpaTrend {
  term: string;
  gpa: number;
}

export const mockStudents: Student[] = [
  { id: "1", name: "Aarav Patel", major: "Computer Science", year: 2, riskTier: "High", riskScore: 88, termGpa: 2.80, attendance: 75, lmsEngagement: 60, email: "a.patel@horizon.edu" },
  { id: "2", name: "Emily Nguyen", major: "Biology", year: 3, riskTier: "Low", riskScore: 22, termGpa: 3.90, attendance: 98, lmsEngagement: 92, email: "e.nguyen@horizon.edu" },
  { id: "3", name: "Daniel Owusu", major: "Business Admin", year: 2, riskTier: "Medium", riskScore: 56, termGpa: 3.10, attendance: 85, lmsEngagement: 78, email: "d.owusu@horizon.edu" },
  { id: "4", name: "Sofia Martinez", major: "Art History", year: 1, riskTier: "Low", riskScore: 15, termGpa: 3.70, attendance: 95, lmsEngagement: 88, email: "s.martinez@horizon.edu" },
  { id: "5", name: "Mei Chen", major: "Engineering", year: 4, riskTier: "High", riskScore: 79, termGpa: 2.40, attendance: 80, lmsEngagement: 65, email: "m.chen@horizon.edu" },
  { id: "6", name: "James Wilson", major: "Psychology", year: 2, riskTier: "Low", riskScore: 18, termGpa: 3.85, attendance: 96, lmsEngagement: 90, email: "j.wilson@horizon.edu" },
  { id: "7", name: "Fatima Al-Said", major: "Mathematics", year: 3, riskTier: "Medium", riskScore: 62, termGpa: 3.05, attendance: 82, lmsEngagement: 75, email: "f.alsaid@horizon.edu" },
  { id: "8", name: "Marcus Johnson", major: "English Literature", year: 1, riskTier: "High", riskScore: 85, termGpa: 2.60, attendance: 70, lmsEngagement: 58, email: "m.johnson@horizon.edu" },
  { id: "9", name: "Isabella Romano", major: "Chemistry", year: 4, riskTier: "Low", riskScore: 25, termGpa: 3.75, attendance: 94, lmsEngagement: 85, email: "i.romano@horizon.edu" },
  { id: "10", name: "Yuki Tanaka", major: "Physics", year: 2, riskTier: "Medium", riskScore: 58, termGpa: 3.00, attendance: 84, lmsEngagement: 72, email: "y.tanaka@horizon.edu" },
  { id: "11", name: "Olivia Brown", major: "Nursing", year: 3, riskTier: "Low", riskScore: 20, termGpa: 3.80, attendance: 97, lmsEngagement: 91, email: "o.brown@horizon.edu" },
  { id: "12", name: "Mohammed Hassan", major: "Economics", year: 2, riskTier: "High", riskScore: 82, termGpa: 2.70, attendance: 76, lmsEngagement: 62, email: "m.hassan@horizon.edu" },
  { id: "13", name: "Chloe Anderson", major: "Political Science", year: 1, riskTier: "Low", riskScore: 16, termGpa: 3.88, attendance: 99, lmsEngagement: 93, email: "c.anderson@horizon.edu" },
  { id: "14", name: "Carlos Hernandez", major: "Mechanical Engineering", year: 4, riskTier: "Medium", riskScore: 64, termGpa: 2.95, attendance: 81, lmsEngagement: 70, email: "c.hernandez@horizon.edu" },
  { id: "15", name: "Aisha Koroma", major: "Sociology", year: 2, riskTier: "Low", riskScore: 19, termGpa: 3.82, attendance: 96, lmsEngagement: 89, email: "a.koroma@horizon.edu" },
  { id: "16", name: "Liam O'Connor", major: "History", year: 3, riskTier: "High", riskScore: 90, termGpa: 2.55, attendance: 68, lmsEngagement: 55, email: "l.oconnor@horizon.edu" },
  { id: "17", name: "Priya Sharma", major: "Computer Science", year: 1, riskTier: "Low", riskScore: 23, termGpa: 3.76, attendance: 95, lmsEngagement: 87, email: "p.sharma@horizon.edu" },
  { id: "18", name: "Noah Kim", major: "Finance", year: 2, riskTier: "Medium", riskScore: 60, termGpa: 3.08, attendance: 83, lmsEngagement: 74, email: "n.kim@horizon.edu" },
  { id: "19", name: "Emma Davis", major: "Environmental Science", year: 4, riskTier: "Low", riskScore: 21, termGpa: 3.79, attendance: 97, lmsEngagement: 90, email: "e.davis@horizon.edu" },
  { id: "20", name: "Alexandre Dubois", major: "Architecture", year: 3, riskTier: "High", riskScore: 87, termGpa: 2.65, attendance: 72, lmsEngagement: 59, email: "a.dubois@horizon.edu" },
  // ... continuing with more students
  { id: "21", name: "Hannah Lee", major: "Biochemistry", year: 2, riskTier: "Low", riskScore: 17, termGpa: 3.84, attendance: 98, lmsEngagement: 92, email: "h.lee@horizon.edu" },
  { id: "22", name: "Diego Silva", major: "Marketing", year: 1, riskTier: "Medium", riskScore: 55, termGpa: 3.12, attendance: 86, lmsEngagement: 76, email: "d.silva@horizon.edu" },
  { id: "23", name: "Zara Khan", major: "Philosophy", year: 3, riskTier: "Low", riskScore: 24, termGpa: 3.74, attendance: 94, lmsEngagement: 86, email: "z.khan@horizon.edu" },
  { id: "24", name: "Ethan Wright", major: "Civil Engineering", year: 4, riskTier: "High", riskScore: 83, termGpa: 2.72, attendance: 77, lmsEngagement: 63, email: "e.wright@horizon.edu" },
  { id: "25", name: "Amara Nwosu", major: "Journalism", year: 2, riskTier: "Low", riskScore: 18, termGpa: 3.86, attendance: 96, lmsEngagement: 91, email: "a.nwosu@horizon.edu" },
  { id: "26", name: "Lucas Müller", major: "Music", year: 1, riskTier: "Medium", riskScore: 61, termGpa: 3.02, attendance: 82, lmsEngagement: 71, email: "l.muller@horizon.edu" },
  { id: "27", name: "Sophia Petrov", major: "International Relations", year: 3, riskTier: "Low", riskScore: 22, termGpa: 3.77, attendance: 95, lmsEngagement: 88, email: "s.petrov@horizon.edu" },
  { id: "28", name: "Ryan Taylor", major: "Information Systems", year: 2, riskTier: "High", riskScore: 86, termGpa: 2.63, attendance: 74, lmsEngagement: 60, email: "r.taylor@horizon.edu" },
  { id: "29", name: "Leila Abbas", major: "Theatre", year: 4, riskTier: "Low", riskScore: 20, termGpa: 3.81, attendance: 97, lmsEngagement: 90, email: "l.abbas@horizon.edu" },
  { id: "30", name: "Benjamin Cohen", major: "Data Science", year: 1, riskTier: "Medium", riskScore: 57, termGpa: 3.09, attendance: 84, lmsEngagement: 73, email: "b.cohen@horizon.edu" },
  { id: "31", name: "Maya Patel", major: "Neuroscience", year: 3, riskTier: "Low", riskScore: 19, termGpa: 3.83, attendance: 98, lmsEngagement: 92, email: "m.patel@horizon.edu" },
  { id: "32", name: "Jacob Anderson", major: "Geology", year: 2, riskTier: "High", riskScore: 81, termGpa: 2.75, attendance: 78, lmsEngagement: 64, email: "j.anderson@horizon.edu" },
  { id: "33", name: "Nadia Al-Rashid", major: "Anthropology", year: 4, riskTier: "Low", riskScore: 16, termGpa: 3.89, attendance: 99, lmsEngagement: 94, email: "n.alrashid@horizon.edu" },
  { id: "34", name: "Tyler Johnson", major: "Supply Chain Mgmt", year: 1, riskTier: "Medium", riskScore: 63, termGpa: 2.98, attendance: 80, lmsEngagement: 69, email: "t.johnson@horizon.edu" },
  { id: "35", name: "Aria Zhang", major: "Statistics", year: 3, riskTier: "Low", riskScore: 21, termGpa: 3.78, attendance: 96, lmsEngagement: 89, email: "a.zhang@horizon.edu" },
  { id: "36", name: "Mason Williams", major: "Agriculture", year: 2, riskTier: "High", riskScore: 89, termGpa: 2.58, attendance: 71, lmsEngagement: 57, email: "m.williams@horizon.edu" },
  { id: "37", name: "Yara Mansour", major: "Linguistics", year: 4, riskTier: "Low", riskScore: 17, termGpa: 3.85, attendance: 97, lmsEngagement: 91, email: "y.mansour@horizon.edu" },
  { id: "38", name: "Owen Murphy", major: "Urban Planning", year: 1, riskTier: "Medium", riskScore: 59, termGpa: 3.06, attendance: 83, lmsEngagement: 72, email: "o.murphy@horizon.edu" },
  { id: "39", name: "Zainab Karim", major: "Public Health", year: 3, riskTier: "Low", riskScore: 23, termGpa: 3.76, attendance: 95, lmsEngagement: 87, email: "z.karim@horizon.edu" },
  { id: "40", name: "Caleb Martinez", major: "Electrical Engineering", year: 2, riskTier: "High", riskScore: 84, termGpa: 2.68, attendance: 75, lmsEngagement: 61, email: "c.martinez@horizon.edu" },
];

export const mockInterventions: Intervention[] = [
  { id: "1", studentId: "1", date: "2025-11-05", type: "Email Check-in", notes: "Sent follow-up email regarding recent attendance issues" },
  { id: "2", studentId: "1", date: "2025-10-28", type: "Advising Session", notes: "Met with student to discuss CS 230 struggles. Recommended tutoring services." },
  { id: "3", studentId: "1", date: "2025-10-22", type: "Advising Session", notes: "Initial check-in. Student seems overwhelmed with course load." },
  { id: "4", studentId: "1", date: "2025-10-15", type: "Tutoring Referral", notes: "Referred student to peer tutoring program for algorithms course" },
  { id: "5", studentId: "1", date: "2025-10-14", type: "Automated Attendance Alert", notes: "Student reported feeling overwhelmed by course load. Discussed time management strategies." },
  { id: "6", studentId: "2", date: "2025-11-01", type: "Recognition", notes: "Congratulated student on excellent mid-term performance" },
  { id: "7", studentId: "3", date: "2025-10-25", type: "Study Group", notes: "Connected student with study group for economics course" },
  { id: "8", studentId: "5", date: "2025-11-03", type: "Academic Warning", notes: "Discussed potential academic probation if grades don't improve" },
  { id: "9", studentId: "5", date: "2025-10-20", type: "Advising Session", notes: "Student struggling with senior capstone project requirements" },
  { id: "10", studentId: "8", date: "2025-10-30", type: "Mental Health Referral", notes: "Referred student to counseling services for stress management" },
];

export const mockGpaTrends: Record<string, GpaTrend[]> = {
  "1": [
    { term: "Fall 2024", gpa: 3.20 },
    { term: "Spring 2025", gpa: 3.05 },
    { term: "Summer 2025", gpa: 2.95 },
    { term: "Fall 2025", gpa: 2.80 },
  ],
  "2": [
    { term: "Fall 2024", gpa: 3.75 },
    { term: "Spring 2025", gpa: 3.82 },
    { term: "Summer 2025", gpa: 3.88 },
    { term: "Fall 2025", gpa: 3.90 },
  ],
  "3": [
    { term: "Fall 2024", gpa: 3.25 },
    { term: "Spring 2025", gpa: 3.18 },
    { term: "Summer 2025", gpa: 3.15 },
    { term: "Fall 2025", gpa: 3.10 },
  ],
  "5": [
    { term: "Fall 2024", gpa: 2.85 },
    { term: "Spring 2025", gpa: 2.65 },
    { term: "Summer 2025", gpa: 2.50 },
    { term: "Fall 2025", gpa: 2.40 },
  ],
};

export const getStudentById = (id: string): Student | undefined => {
  return mockStudents.find(s => s.id === id);
};

export const getInterventionsForStudent = (studentId: string): Intervention[] => {
  return mockInterventions.filter(i => i.studentId === studentId);
};

export const getGpaTrendForStudent = (studentId: string): GpaTrend[] => {
  return mockGpaTrends[studentId] || [];
};
