import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Mail, Lock, User } from "lucide-react";

export const Route = createFileRoute("/register")({ component: Register });

function Register() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome to Khushi's Hub!");
    nav({ to: "/dashboard" });
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (r.error) toast.error(r.error.message);
  }

  return (
    <AuthShell title="Create your account" subtitle="Join the Hub and start sharing.">
      <form onSubmit={onSubmit} className="space-y-3">
        <Field icon={User} placeholder="Full name" value={name} onChange={setName} />
        <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
        <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} required minLength={6} />
        <button disabled={loading} className="w-full btn-glow rounded-xl py-3 text-sm font-medium disabled:opacity-50">
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
      <Divider />
      <button onClick={google} className="w-full glass rounded-xl py-3 text-sm font-medium hover:bg-white/10 transition flex items-center justify-center gap-2">
        <GoogleIcon /> Continue with Google
      </button>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account? <Link to="/login" className="text-foreground hover:text-gradient">Sign in</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 sm:p-10 glow-ring">
        <h1 className="text-3xl font-display font-bold text-center text-gradient">{title}</h1>
        <p className="text-center text-sm text-muted-foreground mt-2 mb-8">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}

export function Field({
  icon: Icon, type = "text", placeholder, value, onChange, required, minLength,
}: {
  icon: React.ComponentType<{ className?: string }>;
  type?: string; placeholder: string; value: string; onChange: (v: string) => void;
  required?: boolean; minLength?: number;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        type={type} placeholder={placeholder} required={required} minLength={minLength}
        value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
      />
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-white/10" /> or <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#fff" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"/><path fill="#fff" opacity=".7" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.5A10 10 0 0 0 12 22z"/><path fill="#fff" opacity=".5" d="M6.4 14a6 6 0 0 1 0-3.9V7.6H3.1a10 10 0 0 0 0 8.9L6.4 14z"/><path fill="#fff" opacity=".8" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6L6.4 10c.8-2.4 3-4 5.6-4z"/></svg>
  );
}
