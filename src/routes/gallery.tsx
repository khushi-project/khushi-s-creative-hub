import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/gallery")({
  component: Gallery,
  head: () => ({ meta: [{ title: "Gallery — Khushi's Hub" }, { name: "description", content: "Public artwork gallery." }] }),
});

type Art = { id: string; title: string; description: string | null; image_url: string; created_at: string };

function Gallery() {
  const [arts, setArts] = useState<Art[]>([]);
  const [counts, setCounts] = useState<Record<string, { l: number; c: number }>>({});

  useEffect(() => {
    (async () => {
      const a = await supabase.from("artworks").select("id,title,description,image_url,created_at").order("created_at", { ascending: false });
      const l = await supabase.from("likes").select("artwork_id");
      const c = await supabase.from("comments").select("artwork_id");
      if (a.data) setArts(a.data);
      const map: Record<string, { l: number; c: number }> = {};
      l.data?.forEach(r => { map[r.artwork_id] = map[r.artwork_id] || { l: 0, c: 0 }; map[r.artwork_id].l++; });
      c.data?.forEach(r => { map[r.artwork_id] = map[r.artwork_id] || { l: 0, c: 0 }; map[r.artwork_id].c++; });
      setCounts(map);
    })();
  }, []);

  return (
    <div className="px-6 py-16 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold"><span className="text-gradient">Artwork Gallery</span></h1>
        <p className="text-muted-foreground mt-3">A canvas of community creations.</p>
        <Link to="/dashboard" className="inline-block mt-5 btn-glow rounded-xl px-5 py-2.5 text-sm font-medium">
          Upload your art
        </Link>
      </div>

      {arts.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center text-muted-foreground">
          No artworks yet. <Link to="/register" className="text-foreground hover:text-gradient">Sign up</Link> to add the first one.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {arts.map((a, i) => (
            <motion.div key={a.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="glass rounded-2xl overflow-hidden glow-ring group"
            >
              <div className="aspect-[4/3] overflow-hidden bg-black/20">
                <img src={a.image_url} alt={a.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{a.title}</h3>
                {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Heart className="h-4 w-4" />{counts[a.id]?.l || 0}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" />{counts[a.id]?.c || 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
