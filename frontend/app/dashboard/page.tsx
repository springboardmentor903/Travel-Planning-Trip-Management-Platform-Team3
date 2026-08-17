import { UserShell } from "../components/user-shell";

const quickStats = [
  { label: "Upcoming trips", value: "3" },
  { label: "Saved places", value: "18" },
  { label: "Avg. trip budget", value: "$1,240" },
  { label: "Trips this year", value: "7" },
];

const trips = [
  { city: "Santorini", country: "Greece", dates: "Jun 12 - Jun 18", status: "Confirmed" },
  { city: "Kyoto", country: "Japan", dates: "Aug 02 - Aug 12", status: "Planning" },
  { city: "Patagonia", country: "Argentina", dates: "Sep 28 - Oct 08", status: "Researching" },
];

export default function DashboardPage() {
  return (
    <UserShell
      title="User Dashboard"
      description="Track your upcoming plans and travel goals in one place."
      activePage="Dashboard"
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Upcoming trips</h3>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                3 active
              </span>
            </div>

            <div className="space-y-3">
              {trips.map((trip) => (
                <div key={`${trip.city}-${trip.dates}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{trip.city}, {trip.country}</p>
                    <p className="text-sm text-slate-500">{trip.dates}</p>
                  </div>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                    {trip.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Travel mood</p>
            <h3 className="mt-3 text-2xl font-semibold">Adventure + comfort</h3>
            <p className="mt-3 text-sm text-slate-300">
              Your profile leans toward scenic destinations, boutique stays, and slower-paced city breaks.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-slate-200">
              <div className="rounded-2xl bg-slate-800 p-3">Beach escapes: 32%</div>
              <div className="rounded-2xl bg-slate-800 p-3">Cultural trips: 28%</div>
              <div className="rounded-2xl bg-slate-800 p-3">Mountain adventures: 40%</div>
            </div>
          </div>
        </section>
      </div>
    </UserShell>
  );
}
