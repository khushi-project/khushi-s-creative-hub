import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  GraduationCap, Briefcase, Code2, FolderGit2, Mail,
  Linkedin, Instagram, Facebook, Youtube,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Khushi Kishor Bhandari" },
      { name: "description", content: "Bio, education, skills, projects and experience of Khushi Kishor Bhandari." },
    ],
  }),
});

const SKILLS = [
  "Java", "JDBC", "HTML", "CSS", "Bootstrap",
  "PHP", "MySQL", "MongoDB", "Express.js", "React.js", "Node.js",
];

const PROJECTS = [
  { name: "Product Management System", tag: "Full-stack" },
  { name: "Expense Tracker", tag: "MERN" },
  { name: "Student Management System", tag: "PHP" },
  { name: "UI / Web Design", tag: "Design" },
];

const SOCIALS = [
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/khushi-k-bhandari" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/iam_khushi_bhandari" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1A7ixhriaM/" },
  { icon: Youtube, label: "YouTube · Cooking", href: "https://youtube.com/@khushibhandari858" },
  { icon: Youtube, label: "YouTube · Art", href: "https://www.youtube.com/@khushisarts1075" },
];

function About() {
  return (
    <div className="px-6 py-16 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-sm text-muted-foreground uppercase tracking-widest">About me</p>
        <h1 className="text-5xl sm:text-6xl font-display font-bold mt-2">
          <span className="text-gradient">Khushi Kishor Bhandari</span>
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Creative & Tech Intern, full-stack developer, and lifelong artist —
          blending engineering with imagination.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card icon={GraduationCap} title="Education">
          <div>
            <p className="font-medium">B.Sc. in Information Technology</p>
            <p className="text-sm text-muted-foreground">N.B. Mehta Science College, Bordi · CGPA 9.70</p>
          </div>
          <div className="mt-4">
            <p className="font-medium">M.Sc. in Information Technology <span className="text-xs text-accent">(pursuing)</span></p>
            <p className="text-sm text-muted-foreground">University of Mumbai — CDOE, Santacruz</p>
          </div>
          <div className="mt-4">
            <p className="font-medium">JavaScript Full Stack & MERN Developer</p>
            <p className="text-sm text-muted-foreground">SDAC Infotech (2024–2025) · Grade A</p>
          </div>
        </Card>

        <Card icon={Briefcase} title="Experience">
          <p className="font-medium">Creative & Tech Intern</p>
          <p className="text-sm text-muted-foreground">Vnest Technologies and Platforms (OPC) Pvt. Ltd.</p>
          <p className="text-xs text-muted-foreground mt-1">22 Feb 2026 — Present</p>
          <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
            <li>Tradefxbook Website</li>
            <li>Fitness Nutrition Intelligence System Website</li>
            <li>Content Writing & Article Creation</li>
            <li>Coda · Figma · Lovable AI</li>
          </ul>
        </Card>

        <Card icon={Code2} title="Skills">
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full text-xs glass border border-white/10 hover:border-primary/40 hover:text-foreground transition">
                {s}
              </span>
            ))}
          </div>
        </Card>

        <Card icon={FolderGit2} title="Projects">
          <ul className="space-y-3">
            {PROJECTS.map((p) => (
              <li key={p.name} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition">
                <span className="font-medium text-sm">{p.name}</span>
                <span className="text-xs px-2 py-1 rounded-md bg-primary/20 text-primary-foreground/90">{p.tag}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Contact + socials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 mt-6 text-center"
      >
        <Mail className="h-6 w-6 mx-auto text-accent" />
        <a href="mailto:khushikbhandari2003@gmail.com" className="block mt-2 text-lg font-medium hover:text-gradient">
          khushikbhandari2003@gmail.com
        </a>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label} href={s.href} target="_blank" rel="noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-xl glass hover:btn-glow hover:scale-105 transition"
            >
              <s.icon className="h-4 w-4" />
              <span className="text-sm">{s.label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className="glass rounded-3xl p-6 sm:p-7 glow-ring"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-display font-semibold">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
