import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        if (roles?.role === "advisor") {
          navigate("/advisor");
        } else {
          navigate("/student");
        }
      }
    });
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
      <div className="text-center max-w-2xl px-4">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
            <GraduationCap className="h-10 w-10 text-primary-foreground" />
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-bold text-foreground">Horizon University</h1>
        <p className="text-xl text-muted-foreground mb-2">Student Success & Early Intervention System</p>
        <p className="text-lg text-muted-foreground mb-8">
          Empowering student success through insight and support
        </p>
        <Button size="lg" onClick={() => navigate("/auth")}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
