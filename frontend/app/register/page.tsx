"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      setSuccess("Your account is ready. Redirecting you to sign in…");
      window.setTimeout(() => router.push("/login"), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#1f6ef5_0%,_#0d4ad5_28%,_#0a2d66_100%)] p-4 sm:p-8">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-[0_40px_90px_rgba(9,18,36,0.45)] backdrop-blur-sm lg:grid-cols-[1.05fr_0.95fr]">
        <div className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.22),_transparent_30%),linear-gradient(135deg,_#0d4ad5_0%,_#0c3bbc_100%)] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-white text-sm font-bold text-[#0d4ad5]">✦</div>
            <span className="text-2xl font-black tracking-[-0.06em] text-white">TripNest</span>
          </div>

          <div className="max-w-sm text-white">
            <span className="mb-6 block text-xs font-semibold uppercase tracking-[0.24em] text-blue-100/80">TripNest</span>
            <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.08em]">Create a trip plan people actually enjoy.</h1>
            <p className="mt-5 text-base leading-7 text-blue-100/85">
              Build destinations, budgets, and personalized experiences for every traveler in a dashboard built to move fast.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/5 p-4 text-sm text-blue-50/90">
            “Your full-travel operating system for planning, budgeting, and organizing every step.”
          </div>
        </div>

        <div className="bg-[#f7f9fd] p-6 sm:p-8 lg:p-10">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start">
              <div className="grid h-7 w-7 place-items-center rounded-md bg-[#eaf1ff] text-xs font-bold text-[#0d4ad5]">✦</div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#1f4db8]">Get started</span>
            </div>
            <h2 className="text-3xl font-black tracking-[-0.06em] text-[#1f2d3d] sm:text-4xl">Create your account</h2>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div role="status" className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#2f4156]">
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#dfe7f5] bg-white px-4 py-3 text-sm text-[#1f2d3d] placeholder-[#7d8ea8] shadow-sm outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#2f4156]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#dfe7f5] bg-white px-4 py-3 text-sm text-[#1f2d3d] placeholder-[#7d8ea8] shadow-sm outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#2f4156]">
                Password
              </label>
              <div className="flex items-center rounded-2xl border border-[#dfe7f5] bg-white shadow-sm transition focus-within:border-[#7ea5ff] focus-within:ring-4 focus-within:ring-[#dfeaff]">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full flex-1 bg-transparent px-4 py-3 text-sm text-[#1f2d3d] placeholder-[#7d8ea8] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 py-3 text-xs font-semibold text-[#1f4db8]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#2f4156]">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#dfe7f5] bg-white px-4 py-3 text-sm text-[#1f2d3d] placeholder-[#7d8ea8] shadow-sm outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
              />
            </div>

            <button
              type="submit"
              disabled={loading || Boolean(success)}
              className="w-full rounded-2xl bg-[#0d4ad5] py-3.5 text-base font-semibold text-white shadow-lg shadow-[#9db8ff] transition hover:bg-[#0b3eb1] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#dfe7f5]" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7183a3]">Or</span>
            <div className="h-px flex-1 bg-[#dfe7f5]" />
          </div>

          <p className="text-center text-sm text-[#53667e]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#1f4db8] hover:text-[#163d9f]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
