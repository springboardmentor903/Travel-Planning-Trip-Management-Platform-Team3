"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, Trip } from "../lib/api";

function destinationLabel(trip: Trip) {
  if (typeof trip.destination === "string") return trip.destination;
  return trip.destination?.name || "Destination";
}

export default function HistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Trip[]>("/trips/my")
      .then((items) => setTrips(items.filter((trip) => trip.status === "COMPLETED")))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Travel history could not be loaded."));
  }, []);

  return <UserShell title="Travel History" description="Review past journeys and revisit favorite experiences." activePage="Travel History">{error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{trips.length ? <div className="space-y-4">{trips.map((trip) => <Link href={`/trips/${trip.id}`} key={trip.id} className="block rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#9bcfc7]"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xl font-semibold text-slate-900">{trip.title}</p><p className="text-sm text-slate-500">{destinationLabel(trip)}</p></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Completed</span></div><p className="mt-4 text-sm text-slate-600">{trip.startDate || "Date unavailable"}{trip.endDate ? ` - ${trip.endDate}` : ""}{trip.description ? ` · ${trip.description}` : ""}</p></Link>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center"><p className="font-semibold text-slate-800">No completed trips yet</p><p className="mt-2 text-sm text-slate-500">Trips marked completed will appear here.</p></div>}</UserShell>;
}
