import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { AuthShell, Field, Divider, GoogleIcon } from "./register";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    nav({ to: "/dashboard" });
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) toast.error(r.error.message);
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Hub.">
      <form onSubmit={onSubmit} className="space-y-3">
        <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
        <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} required />
        <button disabled={loading} className="w-full btn-glow rounded-xl py-3 text-sm font-medium disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <Divider />
      <button onClick={google} className="w-full glass rounded-xl py-3 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2">
        <GoogleIcon /> Continue with Google
      </button>
      <p className="text-center text-sm text-muted-foreground mt-6">
        New here? <Link to="/register" className="text-foreground hover:text-gradient">Create account</Link>
      </p>
    </AuthShell>
  );
}
