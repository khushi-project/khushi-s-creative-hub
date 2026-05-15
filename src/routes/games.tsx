import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gamepad2, Brain, Type, Worm, Bird, Crosshair } from "lucide-react";
import { SnakeGame } from "@/components/games/Snake";
import { MemoryGame } from "@/components/games/Memory";
import { WordPuzzle } from "@/components/games/WordPuzzle";

export const Route = createFileRoute("/games")({
  component: Games,
  head: () => ({ meta: [{ title: "Games — Khushi's Hub" }] }),
});

const GAMES = [
  { id: "snake", name: "Snake", icon: Worm, comp: <SnakeGame /> },
  { id: "memory", name: "Card Matching", icon: Brain, comp: <MemoryGame /> },
  { id: "word", name: "Word Puzzle", icon: Type, comp: <WordPuzzle /> },
  { id: "bubble", name: "Bubble Shooter", icon: Crosshair, comp: <ComingSoon name="Bubble Shooter" /> },
  { id: "birds", name: "Angry Birds", icon: Bird, comp: <ComingSoon name="Angry Birds" /> },
];

function Games() {
  const [active, setActive] = useState(GAMES[0].id);
  const game = GAMES.find((g) => g.id === active)!;

  return (
    <div className="px-6 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <Gamepad2 className="h-10 w-10 mx-auto text-accent" />
        <h1 className="text-5xl font-display font-bold mt-3"><span className="text-gradient">Mini Games</span></h1>
        <p className="text-muted-foreground mt-2">Quick browser games to take a creative break.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setActive(g.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${active === g.id ? "btn-glow" : "glass hover:bg-white/10"}`}>
            <g.icon className="h-4 w-4" />{g.name}
          </button>
        ))}
      </div>

      <div className="glass rounded-3xl p-6 sm:p-8 glow-ring">{game.comp}</div>
    </div>
  );
}

function ComingSoon({ name }: { name: string }) {
  return (
    <div className="text-center py-16">
      <p className="text-2xl font-display font-bold text-gradient">{name}</p>
      <p className="text-sm text-muted-foreground mt-2">Coming soon — under construction. 🚧</p>
    </div>
  );
}
