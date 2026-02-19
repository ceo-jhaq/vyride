import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const DEMO_EMAIL = "passenger@vyride.demo";
  const DEMO_PASSWORD = "demo123";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Please enter email and password", variant: "destructive" });
      return;
    }
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      toast({ title: "Signed in", description: "Demo login successful." });
      navigate("/passenger");
    } else {
      toast({ title: "Invalid credentials", description: "Use demo credentials to sign in.", variant: "destructive" });
    }
  };

  return (
    <AppLayout>
      <section className="container mx-auto px-4 py-12 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Sign in to Vyride</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-lg bg-secondary/40 border border-border/40 text-sm text-muted-foreground">
                <p className="font-medium mb-1">Demo Passenger Credentials</p>
                <p>Email: <code className="bg-secondary px-1 py-0.5 rounded">{DEMO_EMAIL}</code></p>
                <p>Password: <code className="bg-secondary px-1 py-0.5 rounded">{DEMO_PASSWORD}</code></p>
              </div>

              <div>
                <Label className="block mb-1">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
              </div>

              <div>
                <Label className="block mb-1">Password</Label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Checkbox checked={remember} onCheckedChange={(v: boolean) => setRemember(v)} />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <a className="text-sm text-primary">Forgot password?</a>
              </div>

              <div className="flex flex-col gap-2">
                <Button type="submit">Sign in</Button>
                <Button variant="outline" onClick={() => navigate("/")}>Back to Verify</Button>
                <a href="/register" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Don't have an account? <span className="text-primary font-medium">Register</span>
                  </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
};

export default Login;
