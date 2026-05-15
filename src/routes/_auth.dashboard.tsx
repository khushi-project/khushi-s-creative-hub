import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Upload, X, Trash2, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — Khushi's Hub" }] }),
});

const ADS = [
  { title: "Welcome to Khushi's Hub ✨", text: "Your creative playground — share, like, comment.", grad: "from-primary to-accent" },
  { title: "Featured Series: Watercolor Skies", text: "Explore the gallery's most-loved set.", grad: "from-accent to-primary" },
  { title: "Open for Collaborations 🚀", text: "Drop a message via the contact page.", grad: "from-primary via-accent to-primary" },
];

type Artwork = {
  id: string; user_id: string; title: string; description: string | null;
  image_url: string; created_at: string;
};

function Dashboard() {
  const nav = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({});
  const [comments, setComments] = useState<Record<string, { id: string; user_id: string; body: string; created_at: string }[]>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const load = useCallback(async () => {
    const [a, l, c] = await Promise.all([
      supabase.from("artworks").select("*").order("created_at", { ascending: false }),
      supabase.from("likes").select("artwork_id, user_id"),
      supabase.from("comments").select("id, artwork_id, user_id, body, created_at").order("created_at", { ascending: true }),
    ]);
    if (a.data) setArtworks(a.data);
    if (l.data && userId) {
      const map: Record<string, { count: number; liked: boolean }> = {};
      l.data.forEach((row) => {
        if (!map[row.artwork_id]) map[row.artwork_id] = { count: 0, liked: false };
        map[row.artwork_id].count++;
        if (row.user_id === userId) map[row.artwork_id].liked = true;
      });
      setLikes(map);
    }
    if (c.data) {
      const cmap: typeof comments = {};
      c.data.forEach((row) => {
        cmap[row.artwork_id] = [...(cmap[row.artwork_id] || []), row];
      });
      setComments(cmap);
    }
  }, [userId]);

  useEffect(() => { if (userId) load(); }, [userId, load]);

  // auto-slide
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % ADS.length), 4000);
    return () => clearInterval(t);
  }, []);

  async function toggleLike(id: string) {
    if (!userId) return;
    const liked = likes[id]?.liked;
    if (liked) {
      await supabase.from("likes").delete().eq("artwork_id", id).eq("user_id", userId);
    } else {
      await supabase.from("likes").insert({ artwork_id: id, user_id: userId });
    }
    load();
  }

  async function postComment(id: string, body: string) {
    if (!userId || !body.trim()) return;
    const { error } = await supabase.from("comments").insert({ artwork_id: id, user_id: userId, body: body.trim().slice(0, 500) });
    if (error) return toast.error(error.message);
    load();
  }

  async function removeArt(art: Artwork) {
    if (art.user_id !== userId) return;
    if (!confirm("Delete this artwork?")) return;
    const { error } = await supabase.from("artworks").delete().eq("id", art.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function logout() {
    await supabase.auth.signOut();
    nav({ to: "/" });
  }

  return (
    <div className="px-4 sm:px-6 py-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold">Your <span className="text-gradient">Dashboard</span></h1>
          <p className="text-sm text-muted-foreground">Share your art, react and comment.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setUploadOpen(true)} className="btn-glow rounded-xl px-4 py-2 text-sm flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload artwork
          </button>
          <button onClick={logout} className="glass rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative h-48 sm:h-56 rounded-3xl overflow-hidden glass-strong mb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 bg-gradient-to-br ${ADS[slide].grad} flex flex-col items-center justify-center text-center px-6`}
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold">{ADS[slide].title}</h2>
            <p className="text-sm sm:text-base mt-2 text-primary-foreground/90 max-w-lg">{ADS[slide].text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ADS.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-white" : "w-2 bg-white/40"}`} />
          ))}
        </div>
      </div>

      {/* Gallery */}
      <h2 className="text-2xl font-display font-semibold mb-4">Artwork Gallery</h2>
      {artworks.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-muted-foreground">
          No artworks yet — be the first to upload one!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {artworks.map((a) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl overflow-hidden glow-ring group">
              <div className="aspect-[4/3] overflow-hidden bg-black/20">
                <img src={a.image_url} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{a.title}</h3>
                    {a.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.description}</p>}
                  </div>
                  {a.user_id === userId && (
                    <button onClick={() => removeArt(a)} className="text-muted-foreground hover:text-destructive p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                  {new Date(a.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <button onClick={() => toggleLike(a.id)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition ${likes[a.id]?.liked ? "bg-accent/20 text-accent" : "bg-white/5 hover:bg-white/10"}`}>
                    <Heart className={`h-4 w-4 ${likes[a.id]?.liked ? "fill-current" : ""}`} />
                    {likes[a.id]?.count ?? 0}
                  </button>
                  <button onClick={() => setOpenComments(openComments === a.id ? null : a.id)}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                    <MessageCircle className="h-4 w-4" />
                    {comments[a.id]?.length ?? 0}
                  </button>
                </div>
                {openComments === a.id && (
                  <CommentsPanel
                    items={comments[a.id] || []}
                    onPost={(b) => postComment(a.id, b)}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {uploadOpen && userId && <UploadModal userId={userId} onClose={() => setUploadOpen(false)} onDone={load} />}
    </div>
  );
}

function CommentsPanel({ items, onPost }: { items: { id: string; body: string; created_at: string }[]; onPost: (b: string) => void; }) {
  const [val, setVal] = useState("");
  return (
    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
      <div className="max-h-40 overflow-y-auto space-y-2">
        {items.map((c) => (
          <div key={c.id} className="text-sm bg-white/5 rounded-lg p-2">
            <p>{c.body}</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              {new Date(c.created_at).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })}
            </p>
          </div>
        ))}
        {items.length === 0 && <p className="text-xs text-muted-foreground">No comments yet.</p>}
      </div>
      <div className="flex gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder="Add a comment…" maxLength={500}
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
        <button onClick={() => { onPost(val); setVal(""); }} className="btn-glow px-3 py-2 rounded-lg text-sm">Post</button>
      </div>
    </div>
  );
}

function UploadModal({ userId, onClose, onDone }: { userId: string; onClose: () => void; onDone: () => void; }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title.trim() || !file) return toast.error("Add a title and image");
    setLoading(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const up = await supabase.storage.from("artworks").upload(path, file, { contentType: file.type });
    if (up.error) { setLoading(false); return toast.error(up.error.message); }
    const { data: pub } = supabase.storage.from("artworks").getPublicUrl(path);
    const { error } = await supabase.from("artworks").insert({
      user_id: userId, title: title.trim().slice(0, 120),
      description: desc.trim().slice(0, 500) || null, image_url: pub.publicUrl,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Artwork uploaded! 🎨");
    onDone(); onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold">Upload artwork</h3>
          <button onClick={onClose}><X className="h-5 w-5" /></button>
        </div>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" maxLength={120}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description (optional)" maxLength={500} rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/50" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground" />
          <button onClick={submit} disabled={loading} className="w-full btn-glow rounded-xl py-3 text-sm font-medium disabled:opacity-50">
            {loading ? "Uploading…" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
