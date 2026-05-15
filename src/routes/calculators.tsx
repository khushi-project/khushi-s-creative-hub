import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Calculator, Cake, Heart } from "lucide-react";

export const Route = createFileRoute("/calculators")({
  component: Calculators,
  head: () => ({ meta: [{ title: "Tools — Khushi's Hub" }] }),
});

const TOOLS = [
  { id: "basic", name: "Calculator", icon: Calculator },
  { id: "age", name: "Age", icon: Cake },
  { id: "anniv", name: "Anniversary", icon: Heart },
];

function Calculators() {
  const [tab, setTab] = useState("basic");
  return (
    <div className="px-6 py-16 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-display font-bold"><span className="text-gradient">Tools</span></h1>
        <p className="text-muted-foreground mt-2">Quick calculators for everyday moments.</p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition ${tab === t.id ? "btn-glow" : "glass hover:bg-white/10"}`}>
            <t.icon className="h-4 w-4" />{t.name}
          </button>
        ))}
      </div>
      <div className="glass rounded-3xl p-6 sm:p-8 glow-ring">
        {tab === "basic" && <BasicCalc />}
        {tab === "age" && <AgeCalc />}
        {tab === "anniv" && <AnnivCalc />}
      </div>
    </div>
  );
}

function BasicCalc() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState("0");
  const KEYS = ["7","8","9","÷","4","5","6","×","1","2","3","-","0",".","=","+"];
  function press(k: string) {
    if (k === "=") {
      try {
        const r = Function(`"use strict"; return (${expr.replace(/×/g,"*").replace(/÷/g,"/")})`)();
        setOut(String(r));
      } catch { setOut("Error"); }
      return;
    }
    setExpr((e) => e + k);
  }
  return (
    <div className="max-w-xs mx-auto">
      <div className="bg-black/40 rounded-xl p-4 text-right font-mono">
        <p className="text-xs text-muted-foreground h-4 truncate">{expr || "·"}</p>
        <p className="text-3xl font-display">{out}</p>
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        <button onClick={() => { setExpr(""); setOut("0"); }} className="col-span-2 glass rounded-xl py-3 text-sm">Clear</button>
        <button onClick={() => setExpr((e) => e.slice(0,-1))} className="col-span-2 glass rounded-xl py-3 text-sm">⌫</button>
        {KEYS.map((k) => (
          <button key={k} onClick={() => press(k)}
            className={`rounded-xl py-3 text-lg font-display ${k === "=" ? "btn-glow col-span-1" : "glass hover:bg-white/15"}`}>{k}</button>
        ))}
      </div>
    </div>
  );
}

function diff(from: Date) {
  const now = new Date();
  let years = now.getFullYear() - from.getFullYear();
  let months = now.getMonth() - from.getMonth();
  let days = now.getDate() - from.getDate();
  if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (months < 0) { years--; months += 12; }
  const totalDays = Math.floor((now.getTime() - from.getTime()) / 86400000);
  return { years, months, days, totalDays };
}

function AgeCalc() {
  const [d, setD] = useState("");
  const r = d ? diff(new Date(d)) : null;
  return (
    <div className="max-w-sm mx-auto">
      <label className="text-sm text-muted-foreground">Date of birth</label>
      <input type="date" value={d} onChange={(e) => setD(e.target.value)}
        className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
      {r && (
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <Stat label="Years" v={r.years} />
          <Stat label="Months" v={r.months} />
          <Stat label="Days" v={r.days} />
          <div className="col-span-3 text-sm text-muted-foreground mt-2">{r.totalDays.toLocaleString()} days lived ✨</div>
        </div>
      )}
    </div>
  );
}

function AnnivCalc() {
  const [d, setD] = useState("");
  if (!d) {
    return (
      <div className="max-w-sm mx-auto">
        <label className="text-sm text-muted-foreground">Special date</label>
        <input type="date" value={d} onChange={(e) => setD(e.target.value)}
          className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
      </div>
    );
  }
  const start = new Date(d);
  const r = diff(start);
  const next = new Date(start); next.setFullYear(new Date().getFullYear());
  if (next < new Date()) next.setFullYear(next.getFullYear() + 1);
  const daysLeft = Math.ceil((next.getTime() - new Date().getTime()) / 86400000);
  return (
    <div className="max-w-sm mx-auto">
      <label className="text-sm text-muted-foreground">Special date</label>
      <input type="date" value={d} onChange={(e) => setD(e.target.value)}
        className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50" />
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat label="Years" v={r.years} />
        <Stat label="Months" v={r.months} />
        <Stat label="Days" v={r.days} />
      </div>
      <p className="mt-5 text-center text-sm">
        Next anniversary in <span className="text-gradient font-bold">{daysLeft}</span> days 💝
      </p>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="glass rounded-xl py-4">
      <p className="text-3xl font-display font-bold text-gradient">{v}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
