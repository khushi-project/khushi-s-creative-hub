import { useEffect, useRef, useState } from "react";

const SIZE = 20;
const TICK = 110;

type P = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<P[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<P>({ x: 5, y: 5 });
  const [dir, setDir] = useState<P>({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if (e.key === "ArrowUp" && d.y !== 1) setDir({ x: 0, y: -1 });
      if (e.key === "ArrowDown" && d.y !== -1) setDir({ x: 0, y: 1 });
      if (e.key === "ArrowLeft" && d.x !== 1) setDir({ x: -1, y: 0 });
      if (e.key === "ArrowRight" && d.x !== -1) setDir({ x: 1, y: 0 });
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setSnake((s) => {
        const head = { x: s[0].x + dirRef.current.x, y: s[0].y + dirRef.current.y };
        if (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE || s.some((p) => p.x === head.x && p.y === head.y)) {
          setOver(true);
          return s;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = [head, ...s];
        if (!ate) next.pop();
        else {
          setScore((sc) => sc + 1);
          let nf: P;
          do { nf = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) }; }
          while (next.some((p) => p.x === nf.x && p.y === nf.y));
          setFood(nf);
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(t);
  }, [over, food]);

  function reset() {
    setSnake([{ x: 10, y: 10 }]); setFood({ x: 5, y: 5 }); setDir({ x: 1, y: 0 });
    setScore(0); setOver(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Use arrow keys to play</p>
        <p className="font-display font-bold">Score: <span className="text-gradient">{score}</span></p>
      </div>
      <div className="aspect-square w-full max-w-md mx-auto bg-black/40 rounded-xl border border-white/10 grid"
        style={{ gridTemplateColumns: `repeat(${SIZE},1fr)`, gridTemplateRows: `repeat(${SIZE},1fr)` }}>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE, y = Math.floor(i / SIZE);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
          const isFood = food.x === x && food.y === y;
          return <div key={i}
            className={isHead ? "bg-accent rounded-sm" : isBody ? "bg-primary/80 rounded-sm" : isFood ? "bg-pink-400 rounded-full m-0.5" : ""} />;
        })}
      </div>
      {/* Mobile controls */}
      <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto mt-4 sm:hidden">
        <div />
        <button onClick={() => dirRef.current.y !== 1 && setDir({ x: 0, y: -1 })} className="glass py-2 rounded-lg">▲</button>
        <div />
        <button onClick={() => dirRef.current.x !== 1 && setDir({ x: -1, y: 0 })} className="glass py-2 rounded-lg">◀</button>
        <button onClick={reset} className="btn-glow py-2 rounded-lg text-xs">↺</button>
        <button onClick={() => dirRef.current.x !== -1 && setDir({ x: 1, y: 0 })} className="glass py-2 rounded-lg">▶</button>
        <div />
        <button onClick={() => dirRef.current.y !== -1 && setDir({ x: 0, y: 1 })} className="glass py-2 rounded-lg">▼</button>
        <div />
      </div>
      {over && (
        <div className="text-center mt-6">
          <p className="text-xl font-display font-bold">Game over!</p>
          <button onClick={reset} className="btn-glow mt-3 px-5 py-2 rounded-xl text-sm">Play again</button>
        </div>
      )}
    </div>
  );
}
