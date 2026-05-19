import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Toaster } from "@/components/ui/sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/games", label: "Games" },
  { to: "/calculators", label: "Tools" },
  { to: "/contact", label: "Contact" },
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[120px] animate-blob" />
        <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px] animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/15 blur-[120px] animate-blob" style={{ animationDelay: "8s" }} />
      </div>

      <header className="sticky top-0 z-50 glass-strong border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl btn-glow flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Khushi's <span className="text-gradient">Hub</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                activeProps={{ className: "px-3 py-2 text-sm text-foreground rounded-lg bg-white/10" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <Link to="/dashboard" className="btn-glow px-4 py-2 rounded-lg text-sm font-medium">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition">Login</Link>
                <Link to="/register" className="btn-glow px-4 py-2 rounded-lg text-sm font-medium">Sign Up</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-white/5" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1 glass-strong">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="block px-3 py-2 rounded-lg text-sm hover:bg-white/5">
                {n.label}
              </Link>
            ))}
            <div className="pt-2 grid grid-cols-2 gap-2">
              {session ? (
                <Link to="/dashboard" className="col-span-2 btn-glow px-4 py-2 rounded-lg text-sm text-center">Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 rounded-lg text-sm text-center bg-white/5">Login</Link>
                  <Link to="/register" className="btn-glow px-4 py-2 rounded-lg text-sm text-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Khushi Kishor Bhandari. Crafted with ✨</p>
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/iam_khushi_bhandari", label: "Instagram" },
              { Icon: Youtube, href: "https://www.youtube.com/@khushisarts1075", label: "YouTube" },
              { Icon: Facebook, href: "https://www.facebook.com/share/1A7ixhriaM/", label: "Facebook" },
              { Icon: Linkedin, href: "https://www.linkedin.com/in/khushi-k-bhandari", label: "LinkedIn" },
            ].map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="h-9 w-9 rounded-full glass flex items-center justify-center hover:text-foreground hover:bg-white/10 transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p>khushikbhandari2003@gmail.com</p>
        </div>
      </footer>

      <Toaster position="top-right" />
    </div>
  );
}
