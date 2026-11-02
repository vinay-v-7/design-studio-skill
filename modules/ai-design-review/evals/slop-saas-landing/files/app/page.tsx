"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Rocket, ArrowRight, CheckCircle2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/magicui/number-ticker";

const features = [
  { icon: Zap, title: "Lightning Fast Invoicing", body: "Create seamless invoices in seconds with our powerful editor." },
  { icon: Shield, title: "Bank-Level Security", body: "Your data is protected with robust, cutting-edge encryption." },
  { icon: BarChart3, title: "Powerful Analytics", body: "Get intuitive insights into your cash flow, effortlessly." },
];

const stats = [
  { value: 10000, suffix: "+", label: "Happy freelancers" },
  { value: 99.9, suffix: "%", label: "Uptime" },
  { value: 4.9, suffix: "★", label: "Average rating" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm text-white">
            <Sparkles className="h-4 w-4" /> New: AI-powered payment reminders ✨
          </div>
          <h1 className="mt-6 text-6xl font-bold text-white tracking-tight text-center">
            Elevate your invoicing with <span className="bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            The all-in-one platform for freelance photographers. Faster. Smarter. Simpler.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button className="bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/50">Get Started →</Button>
            <Button variant="ghost" className="text-white">Learn More →</Button>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-center text-sm uppercase tracking-widest text-gray-400">Trusted by 500+ companies</p>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-600">Features</p>
        <h2 className="mt-2 text-center text-4xl font-bold">Everything you need to get paid 🚀</h2>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10">
                <f.icon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-gray-400">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-600">How It Works</p>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {["01", "02", "03"].map((n, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-2xl bg-gray-50 p-8 shadow-md">
              <span className="text-5xl font-bold text-indigo-200">{n}</span>
              <h3 className="mt-4 font-semibold">{["Connect Your Account", "Create Your Invoice", "Get Paid Faster"][i]}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-zinc-900/50 p-8 shadow-xl">
              <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                <NumberTicker value={s.value} />{s.suffix}
              </div>
              <p className="mt-2 text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-center text-4xl font-bold">Loved by Freelancers Everywhere</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white p-6 shadow-lg">
              <p className="text-gray-600">"Billr has completely transformed the way I run my business. Game-changing!"</p>
              <div className="mt-4 flex items-center gap-3">
                <img src={`https://i.pravatar.cc/48?img=${i}`} className="h-10 w-10 rounded-full" />
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-sm text-gray-400">Photographer at Acme Inc</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-center text-4xl font-bold">Simple, Transparent Pricing</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {["Starter", "Pro", "Business"].map((tier) => (
            <div key={tier} className={`rounded-2xl p-8 shadow-lg ${tier === "Pro" ? "ring-2 ring-indigo-500 scale-105" : "border"}`}>
              {tier === "Pro" && <span className="rounded-full bg-indigo-500 px-3 py-1 text-xs text-white">Most Popular</span>}
              <h3 className="mt-4 text-2xl font-bold">{tier}</h3>
              <ul className="mt-6 space-y-2">
                <li>✅ Unlimited invoices</li>
                <li>✅ Payment reminders</li>
              </ul>
              <Button className="mt-8 w-full">Get Started</Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-24">
        <h2 className="text-center text-4xl font-bold">Frequently Asked Questions</h2>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 py-24 text-center">
        <h2 className="text-4xl font-bold text-white">Ready to get started?</h2>
        <Button className="mt-8 bg-white text-indigo-600">Get Started Free →</Button>
      </section>

      <footer className="border-t py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-5 gap-8">
          <div><h4 className="font-semibold">Product</h4><a href="#">Features</a></div>
          <div><h4 className="font-semibold">Company</h4><a href="#">About</a></div>
          <div><h4 className="font-semibold">Resources</h4><a href="#">Blog</a></div>
          <div><h4 className="font-semibold">Legal</h4><a href="#">Privacy</a></div>
          <div><p className="font-semibold">Newsletter</p><input placeholder="you@example.com" className="rounded-xl border px-4 py-2" /></div>
        </div>
      </footer>
    </main>
  );
}
