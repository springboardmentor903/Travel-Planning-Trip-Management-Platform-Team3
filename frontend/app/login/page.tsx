"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, saveSession } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api<{ token?: string; email: string; name?: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      saveSession(data.email || email, data.token || null);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "We could not sign you in. Please try again.");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] p-4 sm:p-8 lg:grid lg:place-items-center">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_28px_80px_rgba(23,32,51,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-[640px] overflow-hidden bg-[#172a5c] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#5b8cff]/30 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#28c7b7]/20 blur-3xl" />
          <div className="relative flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-black text-[#2452bb]">T</div><span className="text-xl font-bold tracking-tight">TripNest</span></div>
          <div className="relative max-w-md"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">Your travel workspace</p><h1 className="mt-5 text-5xl font-bold leading-[1.04] tracking-[-0.055em]">Every detail, ready when you are.</h1><p className="mt-6 max-w-sm text-base leading-7 text-blue-100">Build thoughtful itineraries, track budgets, and keep your travel plans beautifully organized.</p></div>
          <div className="relative grid grid-cols-3 gap-3 border-t border-white/15 pt-7 text-sm"><div><p className="text-2xl font-bold">One</p><p className="mt-1 text-blue-100">place to plan</p></div><div><p className="text-2xl font-bold">Clear</p><p className="mt-1 text-blue-100">trip budgets</p></div><div><p className="text-2xl font-bold">Better</p><p className="mt-1 text-blue-100">travel days</p></div></div>
        </section>
        <section className="flex min-h-[620px] items-center bg-white px-6 py-10 sm:px-12 lg:px-14"><div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#2452bb]"><span aria-hidden="true">&larr;</span> Back to home</Link>
          <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4266be]">Welcome back</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-[#172033] sm:text-4xl">Sign in to TripNest</h2><p className="mt-3 text-sm leading-6 text-slate-500">Continue planning the trips that matter to you.</p></div>
          {error && <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-5">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="email">Email address<input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#4266be] focus:ring-4 focus:ring-[#e8eeff]" /></label>
            <div><div className="flex items-center justify-between"><label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label><span className="text-xs text-slate-400">Password help coming soon</span></div><div className="mt-2 flex h-12 items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-[#4266be] focus-within:ring-4 focus-within:ring-[#e8eeff]"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required className="h-full min-w-0 flex-1 rounded-xl bg-transparent px-3.5 text-slate-900 outline-none placeholder:text-slate-400" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} className="px-3.5 text-xs font-bold text-[#3659b4] hover:text-[#172a5c]">{showPassword ? "Hide" : "Show"}</button></div></div>
            <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center rounded-xl bg-[#2452bb] px-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1c4298] disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">New to TripNest? <Link href="/register" className="font-bold text-[#3659b4] hover:text-[#172a5c]">Create an account</Link></p>
        </div></section>
      </div>
    </main>
  );
}
