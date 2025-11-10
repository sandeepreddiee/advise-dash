import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdvisorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/advisor");
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/student");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md p-8 space-y-6">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-heading font-bold text-primary">Horizon University</h1>
            </div>
            <h2 className="text-xl font-heading">System Login</h2>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full"
                onClick={handleAdvisorLogin}
              >
                Login as Advisor
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleStudentLogin}
              >
                Login as Student
              </Button>
            </div>

            <div className="text-center pt-2">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot Password?
              </a>
            </div>
          </form>
        </Card>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary items-center justify-center p-12">
        <div className="text-white space-y-6 max-w-lg">
          <h2 className="text-4xl font-heading font-bold">Empowering Student Success</h2>
          <p className="text-xl text-white/90">Through Insight and Support</p>
          <div className="space-y-4 pt-8">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <p className="text-white/90">Early Detection with Predictive Analytics</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <p className="text-white/90">Centralized Advisor Dashboards</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <p className="text-white/90">Student Self-Service Portal</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
              <p className="text-white/90">Coordinated Intervention Management</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
