import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#e7e1d7] bg-[#fffdfb] shadow-[0_18px_40px_rgba(111,117,128,0.08)] lg:grid-cols-2">
        <div className="bg-[#edf5f4] p-8 text-[#24313f] lg:p-12">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#5d7a78]">TripNest</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#23313f]">
            Turn your next trip into a smooth, memorable plan.
          </h1>
          <p className="mt-5 max-w-md text-base text-[#536874]">
            Keep all your travel preferences, ideas, and booking history in one place.
          </p>

          <div className="mt-12 space-y-4">
            {[
              "Saved itinerary ideas",
              "Personalized destination matches",
              "Travel history with quick rebooking",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#dfe8e2] bg-white px-4 py-3 shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#bfe3d8] text-sm font-bold text-[#1f2d2e]">
                  ✓
                </span>
                <span className="text-sm text-[#4d5d68]">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#f9f5f0] p-8 lg:p-12">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#72818c]">Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#23313f]">Log in</h2>
          </div>

          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#4b5c67]">
                Email address
              </label>
              <input
                id="email"
                type="email"
                defaultValue="ariana@example.com"
                className="w-full rounded-2xl border border-[#e3d9ca] bg-white px-4 py-3 text-[#24313f] outline-none transition focus:border-[#aacfc9] focus:bg-[#fefdfb]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#4b5c67]">
                Password
              </label>
              <input
                id="password"
                type="password"
                defaultValue="password123"
                className="w-full rounded-2xl border border-[#e3d9ca] bg-white px-4 py-3 text-[#24313f] outline-none transition focus:border-[#aacfc9] focus:bg-[#fefdfb]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#556673]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#d8d5ce] text-[#91c9be]" />
                Remember me
              </label>
              <Link href="/forgot-password" className="font-medium text-[#4f7175] hover:text-[#3a5b5d]">
                Forgot password?
              </Link>
            </div>

            <Link
              href="/dashboard"
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#a8d9d3] px-4 py-3 text-base font-semibold text-[#1f2d2e] transition hover:bg-[#9ed0c9]"
            >
              Log in
            </Link>
          </form>

          <p className="mt-8 text-center text-sm text-[#5f6f7a]">
            New to TripNest? {" "}
            <Link href="/register" className="font-semibold text-[#4f7175] hover:text-[#3a5b5d]">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
