"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, Destination, Trip } from "../lib/api";

function dateLabel(trip: Trip) {
  if (!trip.startDate) return "Dates to be decided";
  return `${trip.startDate}${trip.endDate ? ` - ${trip.endDate}` : ""}`;
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api<Trip[]>("/trips"), api<Destination[]>("/destinations")])
      .then(([tripData, destinationData]) => { setTrips(tripData); setDestinations(destinationData); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Dashboard data could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = trips.filter((trip) => trip.status !== "COMPLETED").slice(0, 3);
  const recent = trips.filter((trip) => trip.status === "COMPLETED").slice(0, 3);

  return (
    <UserShell title="User Dashboard" description="Track your upcoming plans and travel goals in one place." activePage="Dashboard">
      {error && <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">Some dashboard data is unavailable: {error}</div>}
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {[["Upcoming trips", upcoming.length], ["Recent trips", recent.length], ["Destinations found", destinations.length]].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold text-slate-900">{loading ? "-" : value}</p></div>)}
        </section>
        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">Upcoming trips</h3><Link href="/trips/new" className="rounded-xl bg-[#173f45] px-3 py-2 text-xs font-semibold text-white">+ Create trip</Link></div>{loading ? <p className="text-sm text-slate-500">Loading trips...</p> : upcoming.length ? <div className="space-y-3">{upcoming.map((trip) => <Link href={`/trips/${trip.id}`} key={trip.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-[#9bcfc7]"><div><p className="font-semibold text-slate-900">{trip.title}</p><p className="text-sm text-slate-500">{trip.destination} · {dateLabel(trip)}</p></div><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{trip.status}</span></Link>)}</div> : <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No upcoming trips yet.</p>}</div>
          <div className="rounded-2xl bg-[#173f45] p-5 text-white"><p className="text-xs uppercase tracking-[0.2em] text-[#a6ddd2]">Discover</p><h3 className="mt-3 text-2xl font-semibold">Find your next destination</h3><p className="mt-3 text-sm leading-6 text-slate-300">Browse popular places, live weather, and trip-ready destination details.</p><Link href="/destinations" className="mt-6 inline-flex rounded-xl bg-[#a8d9d3] px-4 py-2 text-sm font-semibold text-[#173f45]">Explore destinations</Link></div>
        </section>
        <section><div className="flex items-center justify-between"><h3 className="text-lg font-semibold text-slate-900">Recent trips</h3><Link href="/history" className="text-sm font-semibold text-[#396c68]">View history</Link></div>{recent.length ? <div className="mt-3 grid gap-3 md:grid-cols-3">{recent.map((trip) => <Link key={trip.id} href={`/trips/${trip.id}`} className="rounded-xl border border-slate-200 p-4"><p className="font-semibold">{trip.title}</p><p className="mt-1 text-sm text-slate-500">{trip.destination}</p></Link>)}</div> : <p className="mt-3 text-sm text-slate-500">Completed trips will appear here.</p>}</section>
      </div>
    </UserShell>
  );
}
