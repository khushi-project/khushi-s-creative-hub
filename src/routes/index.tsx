import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Palette, Code2, Sparkles, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Khushi's Hub — Creative Developer | Artist | Tech Enthusiast" },
      { name: "description", content: "Welcome to Khushi's Hub — portfolio, artwork gallery, mini-games and tools by Khushi Kishor Bhandari." },
    ],
  }),
});

function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs uppercase tracking-widest text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Open for collabs
          </span>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.05]">
            Welcome to <br />
            <span className="text-gradient">Khushi's Hub</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Creative Developer · Artist · Tech Enthusiast — building delightful
            web experiences and exploring color, code & curiosity.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/about" className="btn-glow rounded-xl px-6 py-3 text-sm font-medium inline-flex items-center gap-2">
              Explore <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/gallery" className="glass rounded-xl px-6 py-3 text-sm font-medium hover:bg-white/10 transition">
              View Art
            </Link>
            <Link to="/contact" className="rounded-xl px-6 py-3 text-sm font-medium border border-white/15 hover:bg-white/5 transition">
              Contact Me
            </Link>
          </div>
        </motion.div>

        {/* Floating cards */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Palette, title: "Artworks", desc: "Hand-crafted pieces & illustrations.", to: "/gallery" },
            { icon: Code2, title: "Projects", desc: "MERN stack, PHP, full-stack builds.", to: "/about" },
            { icon: Gamepad2, title: "Mini Games", desc: "Snake, Memory & Word puzzles.", to: "/games" },
            { icon: Sparkles, title: "Tools", desc: "Age, anniversary, and basic calc.", to: "/calculators" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to={c.to} className="group block glass rounded-2xl p-6 h-full hover:-translate-y-1 hover:shadow-glow transition-all duration-300 glow-ring">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <c.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Ready to <span className="text-gradient">create</span> together?
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Sign up to share your own artwork, drop comments, and join the gallery.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="btn-glow rounded-xl px-6 py-3 text-sm font-medium">
              Get started
            </Link>
            <Link to="/gallery" className="glass rounded-xl px-6 py-3 text-sm font-medium">
              Browse gallery
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
