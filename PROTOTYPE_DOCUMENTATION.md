# Horizon Student Success System - Prototype Submission

**Prototype URL:** https://advise-dash.vercel.app/

---

## 1. Landing/Dashboard Page

The system features a professional login interface with role-based access for Advisors and Students.

**SCREENSHOT 1: Landing Page**
- Go to: https://advise-dash.vercel.app/
- Capture the login page
- Save as: `01-landing-page.png`

---

## 2. Role-Based Interfaces

### Advisor Interface

**SCREENSHOT 2: Advisor Dashboard**
- Click "Login as Advisor"
- Capture the dashboard with stats and student table
- Save as: `02-advisor-dashboard.png`

**SCREENSHOT 3: Risk Alerts**
- Click "Risk Alerts" tab
- Capture the high-risk students table
- Save as: `03-advisor-risk-alerts.png`

**SCREENSHOT 4: Student Detail Page**
- Click any student name
- Capture the student detail page with GPA chart
- Save as: `04-student-detail.png`

**SCREENSHOT 5: Add Intervention**
- Click "Interventions & Notes" tab on student detail page
- Fill the form with sample data (don't submit)
- Save as: `05-add-intervention.png`

### Student Interface

**SCREENSHOT 6: Student Dashboard**
- Go back to home, click "Login as Student"
- Capture the student dashboard
- Save as: `06-student-dashboard.png`

**SCREENSHOT 7: My Progress**
- Click "My Progress" tab
- Capture the GPA history page
- Save as: `07-student-progress.png`

**SCREENSHOT 8: Resources**
- Click "Resources & Support" tab
- Capture the resources page
- Save as: `08-student-resources.png`

---

## 3. Key Functional Features

- **Interactive Tables:** Clickable student rows, sortable columns
- **Data Visualization:** GPA trend charts using Recharts
- **Risk Assessment:** Three-tier color-coded system (Low/Medium/High)
- **Intervention Management:** Form-based note creation with history tracking
- **Navigation:** Tab-based interface with back navigation
- **Responsive Design:** Works on desktop, tablet, and mobile

---

## 4. Data Integration Logic

### Data Structure
- Student records with personal info, GPA, attendance, engagement metrics
- Intervention records linked to student IDs with timestamps
- Historical GPA trends over multiple terms

### Data Flow
**Advisors:** Login → View dashboard stats → Click student → View details → Add intervention  
**Students:** Login → View personal metrics → Track GPA trends → Access resources

### Data Processing
- Real-time calculation of aggregate stats (average GPA, attendance)
- Client-side filtering for risk alerts
- Form data capture for interventions
- Chart data transformation for visualization

---

## Video Walkthrough Script (2-3 min)

**Intro (15 sec):**  
"This is the Horizon Student Success System - a platform for advisors and students to track academic performance and enable early intervention."

**Advisor Demo (60 sec):**  
"Advisors see a dashboard with total students, high-risk count, average GPA, and attendance. The Risk Alerts tab shows students needing attention. Clicking a student opens their profile with GPA trends and intervention history. Advisors can add new intervention notes here."

**Student Demo (45 sec):**  
"Students see their personal dashboard with GPA, attendance, and engagement. The chart shows GPA trends over time. Recommended actions are based on their risk level. The Progress tab shows term history, and Resources connects them to tutoring and counseling."

**Outro (10 sec):**  
"This prototype demonstrates the core functionality ready for feedback before final MVP development."

---

## Screenshot Checklist
- [ ] 01-landing-page.png
- [ ] 02-advisor-dashboard.png
- [ ] 03-advisor-risk-alerts.png
- [ ] 04-student-detail.png
- [ ] 05-add-intervention.png
- [ ] 06-student-dashboard.png
- [ ] 07-student-progress.png
- [ ] 08-student-resources.png
