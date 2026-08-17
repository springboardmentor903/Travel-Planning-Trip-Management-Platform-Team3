import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl overflow-hidden rounded-[28px] border border-[#e7e1d7] bg-[#fffdfb] shadow-[0_18px_40px_rgba(111,117,128,0.08)]">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="bg-[#edf5f4] p-8 text-[#24313f] lg:p-12">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#5d7a78]">Start planning</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight text-[#23313f]">
              Create your travel profile and explore personalized recommendations.
            </h1>
            <p className="mt-5 max-w-md text-base text-[#536874]">
              Save your favorite places, set travel preferences, and revisit past trips with ease.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                ["Smart matching", "Discover destinations that fit your style."],
                ["Trip tracking", "Keep plans, bookings, and memories together."],
                ["Wishlists", "Save your dream places for your next adventure."],
                ["Travel insights", "See patterns in your past trips."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-[#dfe8e2] bg-white p-4 shadow-sm">
                  <p className="text-base font-semibold text-[#23313f]">{title}</p>
                  <p className="mt-2 text-sm text-[#536874]">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#f9f5f0] p-8 lg:p-12">
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#72818c]">New account</p>
              <h2 className="mt-2 text-3xl font-semibold text-[#23313f]">Register</h2>
            </div>

            <form className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#4b5c67]">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  defaultValue="Ariana Smith"
                  className="w-full rounded-2xl border border-[#e3d9ca] bg-white px-4 py-3 text-[#24313f] outline-none transition focus:border-[#aacfc9] focus:bg-[#fefdfb]"
                />
              </div>

              <div>
                <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-[#4b5c67]">
                  Email address
                </label>
                <input
                  id="register-email"
                  type="email"
                  defaultValue="ariana@example.com"
                  className="w-full rounded-2xl border border-[#e3d9ca] bg-white px-4 py-3 text-[#24313f] outline-none transition focus:border-[#aacfc9] focus:bg-[#fefdfb]"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-[#4b5c67]">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  defaultValue="password123"
                  className="w-full rounded-2xl border border-[#e3d9ca] bg-white px-4 py-3 text-[#24313f] outline-none transition focus:border-[#aacfc9] focus:bg-[#fefdfb]"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-[#4b5c67]">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  defaultValue="password123"
                  className="w-full rounded-2xl border border-[#e3d9ca] bg-white px-4 py-3 text-[#24313f] outline-none transition focus:border-[#aacfc9] focus:bg-[#fefdfb]"
                />
              </div>

              <div className="flex items-start gap-2 text-sm text-[#5f6f7a]">
                <input type="checkbox" defaultChecked className="mt-1 h-4 w-4 rounded border-[#d8d5ce] text-[#91c9be]" />
                <span>
                  I agree to the Terms of Service and Privacy Policy.
                </span>
              </div>

              <Link
                href="/dashboard"
                className="mt-4 flex w-full items-center justify-center rounded-2xl bg-[#a8d9d3] px-4 py-3 text-base font-semibold text-[#1f2d2e] transition hover:bg-[#9ed0c9]"
              >
                Create account
              </Link>
            </form>

            <p className="mt-8 text-center text-sm text-[#5f6f7a]">
              Already have an account? {" "}
              <Link href="/login" className="font-semibold text-[#4f7175] hover:text-[#3a5b5d]">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
