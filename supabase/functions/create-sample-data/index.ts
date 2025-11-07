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

    console.log("Starting sample data creation...");

    // Check if term exists
    let termId;
    const { data: existingTerm } = await supabase
      .from("terms")
      .select("term_id")
      .eq("term_name", "Fall 2025")
      .single();

    if (existingTerm) {
      termId = existingTerm.term_id;
      console.log("Using existing term:", termId);
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
      console.log("Created new term:", termId);
    }

    // Check if courses exist
    let courseId;
    const { data: existingCourse } = await supabase
      .from("courses")
      .select("course_id")
      .limit(1)
      .single();

    if (existingCourse) {
      courseId = existingCourse.course_id;
      console.log("Using existing course:", courseId);
    } else {
      const courses = [
        { dept: "CS", level: 101, title: "Introduction to Programming" },
        { dept: "MATH", level: 201, title: "Calculus I" },
        { dept: "ENG", level: 101, title: "English Composition" },
      ];

      const { data: coursesData } = await supabase
        .from("courses")
        .insert(courses)
        .select();

      courseId = coursesData?.[0]?.course_id;
      console.log("Created courses, using:", courseId);
    }

    // Create sample students
    const sampleStudents = [
      { name: "Aarav Patel", major: "Computer Science", gpa: 2.80, risk: "High" },
      { name: "Emily Nguyen", major: "Biology", gpa: 3.90, risk: "Low" },
      { name: "Daniel Owusu", major: "Business Admin", gpa: 3.10, risk: "Medium" },
      { name: "Sofia Martinez", major: "Art History", gpa: 3.70, risk: "Low" },
      { name: "Mei Chen", major: "Engineering", gpa: 2.40, risk: "High" },
    ];

    let created = 0;
    for (const student of sampleStudents) {
      // Check if student already exists
      const { data: existing } = await supabase
        .from("students")
        .select("student_id")
        .eq("name", student.name)
        .single();

      if (existing) {
        console.log("Student already exists:", student.name);
        continue;
      }

      const { data: studentData } = await supabase
        .from("students")
        .insert({
          name: student.name,
          major: student.major,
          cumulative_gpa: student.gpa,
          age: 19 + Math.floor(Math.random() * 4),
          gender: "Not specified",
          first_gen: Math.random() > 0.5,
        })
        .select()
        .single();

      if (studentData) {
        const isHigh = student.risk === "High";
        const isMed = student.risk === "Medium";

        // Add risk score
        await supabase.from("risk_scores").insert({
          student_id: studentData.student_id,
          term_id: termId,
          risk_score: isHigh ? 80 : (isMed ? 55 : 25),
          risk_tier: student.risk,
        });

        // Add attendance
        await supabase.from("attendance").insert({
          student_id: studentData.student_id,
          course_id: courseId,
          term_id: termId,
          month: "November",
          attendance_pct: isHigh ? 72 : (isMed ? 84 : 96),
        });

        // Add LMS data
        await supabase.from("lms_events").insert({
          student_id: studentData.student_id,
          course_id: courseId,
          term_id: termId,
          grain: "weekly",
          date: new Date().toISOString().split('T')[0],
          logins: isHigh ? 3 : (isMed ? 6 : 12),
          time_on_platform_min: isHigh ? 45 : (isMed ? 90 : 150),
        });

        created++;
        console.log("Created student:", student.name);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Created ${created} sample students`,
      termId,
      courseId,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
