import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e8e0d5] bg-[#fffdfb] shadow-[0_18px_40px_rgba(111,117,128,0.08)]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-[#edf5f4] p-8 lg:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#5d7a78]">TripNest</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#23313f] lg:text-5xl">
              Plan better trips with a travel profile built around you.
            </h1>
            <p className="mt-5 max-w-lg text-base text-[#4b5c67]">
              Save favorite destinations, track travel history, and find recommendations that feel personal.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ["18", "saved places"],
                ["7", "trips this year"],
                ["4.9/5", "traveler rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-[#dfe8e2] bg-white p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-[#23313f]">{value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#6f7f87]">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center bg-[#f9f5f0] p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#72818c]">Welcome</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#23313f]">Your next trip starts here</h2>
            </div>

            <div className="space-y-4">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-2xl bg-[#a8d9d3] px-4 py-3 text-base font-semibold text-[#1f2d2e] transition hover:bg-[#9ed0c9]"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="flex w-full items-center justify-center rounded-2xl border border-[#dfe4dc] bg-white px-4 py-3 text-base font-semibold text-[#2a3944] transition hover:bg-[#f4f8f7]"
              >
                Create account
              </Link>
            </div>

            <p className="mt-6 text-sm text-[#5f6f7a]">
              A calmer place to manage your trips, preferences, and travel memories.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
