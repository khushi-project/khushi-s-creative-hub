import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthGate,
});

function AuthGate() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => subscription.unsubscribe();
  }, []);

  if (!ready) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="glass rounded-3xl p-10 text-center max-w-md">
          <h2 className="text-2xl font-display font-bold">Sign in required</h2>
          <p className="text-sm text-muted-foreground mt-2">You need to be signed in to view this page.</p>
          <div className="flex gap-3 justify-center mt-6">
            <Link to="/login" className="btn-glow px-5 py-2.5 rounded-xl text-sm font-medium">Sign in</Link>
            <Link to="/register" className="glass px-5 py-2.5 rounded-xl text-sm font-medium">Sign up</Link>
          </div>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
