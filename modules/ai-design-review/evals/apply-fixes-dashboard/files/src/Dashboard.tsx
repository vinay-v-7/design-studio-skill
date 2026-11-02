import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, AlertTriangle, Activity, Clock } from "lucide-react";
import CountUp from "react-countup";

type Incident = { id: string; title: string; service: string; severity: "SEV1" | "SEV2" | "SEV3"; minutesOpen: number; owner: string };

const kpis = [
  { label: "Open Incidents", value: 3, icon: AlertTriangle },
  { label: "MTTR (min)", value: 42, icon: Clock },
  { label: "Uptime", value: 99.99, icon: Activity },
  { label: "Alerts Today", value: 128, icon: Zap },
];

export default function Dashboard({ incidents }: { incidents: Incident[] }) {
  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-violet-600/30 to-indigo-600/30 p-8 backdrop-blur-xl border border-white/10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Welcome back, John! 👋
        </h1>
        <p className="mt-2 text-zinc-400">Your next-generation, AI-powered incident command center ✨</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl shadow-violet-500/20 backdrop-blur-md">
            <div className="rounded-2xl border border-white/10 bg-zinc-800/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
                <k.icon className="h-5 w-5 text-violet-400" />
              </div>
              <div className="mt-4 text-3xl font-bold"><CountUp end={k.value} decimals={k.value % 1 ? 2 : 0} /></div>
              <div className="text-sm text-zinc-500">{k.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md">
        <h2 className="flex items-center gap-2 text-xl font-semibold"><Sparkles className="h-5 w-5 text-violet-400" /> AI Insights</h2>
        <p className="mt-2 text-zinc-400">Our cutting-edge AI detected no anomalies. Everything is running seamlessly! 🎉</p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md">
        <h2 className="text-xl font-semibold">Active Incidents</h2>
        <div className="mt-4 space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className="rounded-2xl border border-white/10 bg-zinc-800/50 p-4 flex items-center justify-between" onClick={() => {}}>
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${["bg-green-400", "bg-blue-400", "bg-pink-400"][Number(inc.id) % 3]}`} />
                <span className="font-medium">{inc.title}</span>
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">New</span>
              </div>
              <span className="text-zinc-500">{inc.service}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
