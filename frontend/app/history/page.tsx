import { UserShell } from "../components/user-shell";

const trips = [
  { destination: "Rome", period: "Apr 2025", summary: "Food trails, museum weekends, and a family villa stay." },
  { destination: "Seoul", period: "Nov 2024", summary: "Night markets, temple walks, and multi-day city passes." },
  { destination: "Cape Town", period: "Feb 2024", summary: "Mountain drives, wine routes, and coastal day tours." },
];

export default function HistoryPage() {
  return (
    <UserShell
      title="Travel History"
      description="Review past journeys and revisit favorite experiences."
      activePage="Travel History"
    >
      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.destination} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xl font-semibold text-slate-900">{trip.destination}</p>
                <p className="text-sm text-slate-500">{trip.period}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                Completed
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{trip.summary}</p>
          </div>
        ))}
      </div>
    </UserShell>
  );
}
