import { useEffect, useState } from "react";

const WORDS = ["REACT", "DESIGN", "ARTIST", "CODING", "GALAXY", "PIXEL", "STUDIO", "CRAFT", "PALETTE", "VECTOR"];

function scramble(w: string) {
  const a = w.split("");
  do {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
  } while (a.join("") === w);
  return a.join("");
}

export function WordPuzzle() {
  const [word, setWord] = useState(WORDS[0]);
  const [scrambled, setScrambled] = useState(scramble(WORDS[0]));
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");

  function next() {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w); setScrambled(scramble(w)); setGuess(""); setMsg("");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (guess.trim().toUpperCase() === word) {
      setScore((s) => s + 1);
      setMsg("✨ Correct!");
      setTimeout(next, 800);
    } else {
      setMsg("❌ Try again");
    }
  }

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">Unscramble the word</p>
      <div className="my-8">
        <div className="flex justify-center gap-2 flex-wrap">
          {scrambled.split("").map((c, i) => (
            <span key={i} className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl glass-strong flex items-center justify-center text-2xl font-display font-bold">
              {c}
            </span>
          ))}
        </div>
      </div>
      <form onSubmit={submit} className="flex gap-2 max-w-sm mx-auto">
        <input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Your answer"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm uppercase tracking-widest focus:outline-none focus:border-primary/50" />
        <button className="btn-glow px-5 rounded-xl text-sm">Check</button>
      </form>
      <p className="mt-4 h-5 text-sm">{msg}</p>
      <div className="mt-4 flex justify-center gap-3">
        <p className="font-display font-bold">Score: <span className="text-gradient">{score}</span></p>
        <button onClick={next} className="text-sm text-muted-foreground hover:text-foreground underline">Skip →</button>
      </div>
    </div>
  );
}
