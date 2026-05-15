import { useEffect, useState } from "react";

const EMOJIS = ["🎨", "🌸", "🚀", "🌙", "⭐", "🎭", "🦋", "💎"];

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDeck(): Card[] {
  return shuffle([...EMOJIS, ...EMOJIS]).map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
}

export function MemoryGame() {
  const [cards, setCards] = useState<Card[]>(makeDeck);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const won = cards.every((c) => c.matched);

  useEffect(() => {
    if (picked.length !== 2) return;
    const [a, b] = picked;
    setMoves((m) => m + 1);
    const t = setTimeout(() => {
      setCards((cs) =>
        cs.map((c) => {
          if (c.id !== a && c.id !== b) return c;
          if (cs[a].emoji === cs[b].emoji) return { ...c, matched: true };
          return { ...c, flipped: false };
        })
      );
      setPicked([]);
    }, 700);
    return () => clearTimeout(t);
  }, [picked]);

  function flip(id: number) {
    if (picked.length === 2) return;
    setCards((cs) => cs.map((c) => (c.id === id && !c.matched ? { ...c, flipped: true } : c)));
    setPicked((p) => (p.includes(id) ? p : [...p, id]));
  }

  function reset() { setCards(makeDeck()); setPicked([]); setMoves(0); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Match all the pairs</p>
        <p className="font-display font-bold">Moves: <span className="text-gradient">{moves}</span></p>
      </div>
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((c) => (
          <button key={c.id} onClick={() => flip(c.id)}
            className={`aspect-square rounded-xl text-3xl sm:text-4xl flex items-center justify-center transition-all duration-300 ${
              c.flipped || c.matched
                ? "bg-gradient-to-br from-primary to-accent rotate-0"
                : "glass hover:bg-white/15"
            } ${c.matched ? "opacity-60" : ""}`}>
            {c.flipped || c.matched ? c.emoji : "?"}
          </button>
        ))}
      </div>
      <div className="text-center mt-6">
        {won && <p className="text-xl font-display font-bold mb-3">🎉 You won in {moves} moves!</p>}
        <button onClick={reset} className="btn-glow px-5 py-2 rounded-xl text-sm">New game</button>
      </div>
    </div>
  );
}
