import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, MessageSquare, User } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact — Khushi's Hub" }, { name: "description", content: "Get in touch with Khushi." }] }),
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

function Contact() {
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(data);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Message sent! I'll get back to you soon. 💌");
    setData({ name: "", email: "", message: "" });
  }

  return (
    <div className="px-6 py-20 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-5xl font-display font-bold text-center"><span className="text-gradient">Let's talk</span></h1>
        <p className="text-center text-muted-foreground mt-3">
          Have a project, idea, or just want to say hi? Drop a message below.
        </p>

        <form onSubmit={submit} className="glass rounded-3xl p-8 mt-10 space-y-4 glow-ring">
          <FieldWrap icon={User}>
            <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Your name" maxLength={100}
              className="w-full bg-transparent outline-none text-sm" />
          </FieldWrap>
          <FieldWrap icon={Mail}>
            <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}
              placeholder="you@example.com" maxLength={255}
              className="w-full bg-transparent outline-none text-sm" />
          </FieldWrap>
          <FieldWrap icon={MessageSquare} align="top">
            <textarea value={data.message} onChange={(e) => setData({ ...data, message: e.target.value })}
              placeholder="Your message…" maxLength={2000} rows={6}
              className="w-full bg-transparent outline-none text-sm resize-none" />
          </FieldWrap>
          <button disabled={loading} className="w-full btn-glow rounded-xl py-3 text-sm font-medium disabled:opacity-50">
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function FieldWrap({ icon: Icon, children, align = "center" }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; align?: "center" | "top"; }) {
  return (
    <div className={`flex gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-primary/60 transition ${align === "top" ? "items-start" : "items-center"}`}>
      <Icon className={`h-4 w-4 text-muted-foreground ${align === "top" ? "mt-1" : ""}`} />
      {children}
    </div>
  );
}
