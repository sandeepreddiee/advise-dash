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
    const { studentId } = await req.json();
    
    if (!studentId) {
      throw new Error("studentId is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch student data
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select(`
        *,
        term_gpas (*),
        attendance (*),
        lms_events (*),
        financial_aid (*),
        enrollments (*)
      `)
      .eq("student_id", studentId)
      .single();

    if (studentError) throw studentError;

    // Calculate features
    const avgGPA = student.cumulative_gpa || 0;
    const recentAttendance = student.attendance?.[0]?.attendance_pct || 0;
    const lmsActivity = student.lms_events?.slice(0, 5) || [];
    const avgLogins = lmsActivity.length > 0 
      ? lmsActivity.reduce((sum: number, e: any) => sum + (e.logins || 0), 0) / lmsActivity.length
      : 0;
    const hasFinancialAid = student.financial_aid?.[0]?.aid_amount_usd > 0;
    const courseLoad = student.enrollments?.length || 0;

    // Create prompt for AI model
    const prompt = `You are an academic risk prediction system for universities. Analyze the following student data and predict their dropout risk.

Student Data:
- GPA: ${avgGPA.toFixed(2)} (scale 0-4.0)
- Attendance: ${recentAttendance.toFixed(1)}%
- Average LMS Logins per week: ${avgLogins.toFixed(1)}
- Has Financial Aid: ${hasFinancialAid ? 'Yes' : 'No'}
- Current Course Load: ${courseLoad} courses
- First Generation: ${student.first_gen ? 'Yes' : 'No'}

Based on research, provide:
1. A risk score (0-100, where 100 is highest risk)
2. A risk tier (Low, Medium, or High)
3. Top 3 specific intervention recommendations

Format your response as JSON:
{
  "risk_score": <number>,
  "risk_tier": "<Low|Medium|High>",
  "interventions": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a university student success prediction system. Always respond with valid JSON only." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    // Parse AI response
    let prediction;
    try {
      prediction = JSON.parse(aiContent);
    } catch (e) {
      console.error("Failed to parse AI response:", aiContent);
      // Fallback to rule-based prediction
      prediction = calculateRuleBased(avgGPA, recentAttendance, avgLogins, hasFinancialAid);
    }

    // Update or create risk score in database
    const { error: upsertError } = await supabase
      .from("risk_scores")
      .upsert({
        student_id: studentId,
        risk_score: prediction.risk_score,
        risk_tier: prediction.risk_tier,
        intervention_type: prediction.interventions?.join("; "),
        note_date: new Date().toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'student_id'
      });

    if (upsertError) {
      console.error("Error updating risk score:", upsertError);
    }

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in predict-risk function:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

// Rule-based fallback prediction
function calculateRuleBased(gpa: number, attendance: number, logins: number, hasAid: boolean) {
  let score = 0;
  
  // GPA component (40% weight)
  if (gpa < 2.0) score += 40;
  else if (gpa < 2.5) score += 30;
  else if (gpa < 3.0) score += 15;
  else score += 5;
  
  // Attendance component (30% weight)
  if (attendance < 70) score += 30;
  else if (attendance < 80) score += 20;
  else if (attendance < 90) score += 10;
  else score += 5;
  
  // Engagement component (20% weight)
  if (logins < 2) score += 20;
  else if (logins < 5) score += 10;
  else score += 5;
  
  // Financial aid (10% weight - inverse)
  if (!hasAid) score += 10;
  
  let tier: "Low" | "Medium" | "High";
  if (score >= 60) tier = "High";
  else if (score >= 35) tier = "Medium";
  else tier = "Low";
  
  return {
    risk_score: Math.min(score, 100),
    risk_tier: tier,
    interventions: [
      "Schedule regular check-ins with academic advisor",
      "Utilize campus tutoring and support services",
      "Join study groups and peer mentoring programs"
    ]
  };
}
