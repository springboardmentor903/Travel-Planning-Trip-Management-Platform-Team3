"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Trip } from "../lib/api";
import { UserShell } from "../components/user-shell";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]); const [error, setError] = useState("");
  useEffect(() => { api<Trip[]>("/trips").then(setTrips).catch((e) => setError(e.message)); }, []);
  return <UserShell title="My trips" description="Keep every route, reservation, and idea in one place." activePage="My Trips">
    <div className="flex items-center justify-between"><p className="text-sm text-slate-500">{trips.length} saved trips</p><Link className="rounded-xl bg-[#173f45] px-4 py-2 text-sm font-semibold text-white" href="/trips/new">+ New trip</Link></div>
    {error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}. Start the backend and sign in again.</p>}
    <div className="mt-5 grid gap-4 md:grid-cols-2">{trips.map((trip) => <Link key={trip.id} href={`/trips/${trip.id}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#9bcfc7]"><div className="flex justify-between gap-3"><h3 className="text-xl font-semibold text-slate-900">{trip.title}</h3><span className="text-xs font-semibold uppercase text-[#4f7175]">{trip.status}</span></div><p className="mt-2 text-sm text-slate-600">{trip.destination}</p><p className="mt-5 text-sm text-slate-500">{trip.startDate || "Date to be decided"} {trip.endDate ? ` - ${trip.endDate}` : ""}</p></Link>)}</div>
    {!error && trips.length === 0 && <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No trips yet. Create your first plan.</div>}
  </UserShell>;
}