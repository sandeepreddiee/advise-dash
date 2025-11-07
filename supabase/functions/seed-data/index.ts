import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Create current term
    const { data: term, error: termError } = await supabase
      .from("terms")
      .insert({
        term_name: "Fall 2025",
        start_date: "2025-09-01",
        weeks: 16,
      })
      .select()
      .single();

    if (termError) throw termError;

    // Create sample courses
    const courses = [
      { dept: "CS", level: 101, title: "Introduction to Programming" },
      { dept: "MATH", level: 201, title: "Calculus I" },
      { dept: "ENG", level: 101, title: "English Composition" },
      { dept: "BIO", level: 150, title: "General Biology" },
      { dept: "HIST", level: 101, title: "World History" },
    ];

    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .insert(courses)
      .select();

    if (coursesError) throw coursesError;

    // Create sample students with varying risk profiles
    const students = [
      { name: "Aarav Patel", major: "Computer Science", cumulative_gpa: 2.80, first_gen: true, age: 19, gender: "Male" },
      { name: "Emily Nguyen", major: "Biology", cumulative_gpa: 3.90, first_gen: false, age: 20, gender: "Female" },
      { name: "Daniel Owusu", major: "Business Admin", cumulative_gpa: 3.10, first_gen: false, age: 21, gender: "Male" },
      { name: "Sofia Martinez", major: "Art History", cumulative_gpa: 3.70, first_gen: true, age: 19, gender: "Female" },
      { name: "Mei Chen", major: "Engineering", cumulative_gpa: 2.40, first_gen: true, age: 20, gender: "Female" },
    ];

    const { data: studentsData, error: studentsError } = await supabase
      .from("students")
      .insert(students)
      .select();

    if (studentsError) throw studentsError;

    // Add risk scores, attendance, and LMS data
    for (let i = 0; i < studentsData.length; i++) {
      const student = studentsData[i];
      const isHighRisk = student.cumulative_gpa < 2.8;
      const isMediumRisk = student.cumulative_gpa >= 2.8 && student.cumulative_gpa < 3.3;

      // Risk scores
      await supabase.from("risk_scores").insert({
        student_id: student.student_id,
        term_id: term.term_id,
        risk_score: isHighRisk ? 75 + Math.random() * 15 : (isMediumRisk ? 40 + Math.random() * 20 : 10 + Math.random() * 20),
        risk_tier: isHighRisk ? "High" : (isMediumRisk ? "Medium" : "Low"),
        intervention_type: isHighRisk ? "Academic counseling recommended" : "Regular check-in",
      });

      // Attendance
      await supabase.from("attendance").insert({
        student_id: student.student_id,
        course_id: coursesData[0].course_id,
        term_id: term.term_id,
        month: "November",
        attendance_pct: isHighRisk ? 70 + Math.random() * 10 : (isMediumRisk ? 80 + Math.random() * 10 : 92 + Math.random() * 8),
      });

      // LMS events
      for (let j = 0; j < 5; j++) {
        await supabase.from("lms_events").insert({
          student_id: student.student_id,
          course_id: coursesData[j % coursesData.length].course_id,
          term_id: term.term_id,
          grain: "weekly",
          date: new Date(Date.now() - j * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          logins: isHighRisk ? Math.floor(Math.random() * 3) : Math.floor(5 + Math.random() * 10),
          time_on_platform_min: isHighRisk ? Math.floor(20 + Math.random() * 40) : Math.floor(60 + Math.random() * 120),
          assignments_submitted: Math.floor(Math.random() * 3),
        });
      }

      // Financial aid
      await supabase.from("financial_aid").insert({
        student_id: student.student_id,
        household_income_usd: 40000 + Math.floor(Math.random() * 80000),
        scholarship_flag: Math.random() > 0.5,
        aid_amount_usd: Math.floor(5000 + Math.random() * 15000),
        work_hours_per_week: Math.floor(Math.random() * 20),
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Sample data created successfully",
      students: studentsData.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error seeding data:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
