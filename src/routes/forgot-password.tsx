import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { AuthShell, Field } from "./register";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
  head: () => ({ meta: [{ title: "Forgot password — Khushi's Hub" }] }),
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
    toast.success("Reset link sent — check your inbox.");
  }

  return (
    <AuthShell title="Forgot password" subtitle="We'll email you a reset link.">
      {sent ? (
        <div className="text-center text-sm text-muted-foreground space-y-4">
          <p>If an account exists for <span className="text-foreground">{email}</span>, a reset link is on its way.</p>
          <Link to="/login" className="inline-block btn-glow rounded-xl px-5 py-2.5 text-sm font-medium">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <Field icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
          <button disabled={loading} className="w-full btn-glow rounded-xl py-3 text-sm font-medium disabled:opacity-50">
            {loading ? "Sending…" : "Send reset link"}
          </button>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Remembered it? <Link to="/login" className="text-foreground hover:text-gradient">Sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
