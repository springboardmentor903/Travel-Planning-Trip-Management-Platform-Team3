"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, Destination, Trip } from "../lib/api";

function dateLabel(trip: Trip) {
  if (!trip.startDate) return "Dates to be decided";
  return `${trip.startDate}${trip.endDate ? ` - ${trip.endDate}` : ""}`;
}

function destinationLabel(trip: Trip) {
  if (typeof trip.destination === "string") return trip.destination;
  return trip.destination?.name || "Destination";
}

export default function DashboardPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      api<Trip[]>("/trips/my"),
      api<Destination[]>("/destinations/popular"),
    ])
      .then(([tripData, destinationData]) => {
        setTrips(tripData || []);
        setDestinations(destinationData || []);
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Dashboard data could not be loaded."))
      .finally(() => setLoading(false));
  }, []);

  const upcoming = trips.filter((trip) => !["COMPLETED", "CANCELLED"].includes(String(trip.status))).slice(0, 3);
  const recent = trips.filter((trip) => ["COMPLETED", "CANCELLED"].includes(String(trip.status))).slice(0, 3);

  return (
    <UserShell title="User Dashboard" description="Track your upcoming plans and travel goals in one place." activePage="Dashboard">
      {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Some dashboard data is unavailable: {error}</div>}
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Upcoming trips", upcoming.length],
            ["Recent trips", recent.length],
            ["Destinations found", destinations.length],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-[24px] border border-[#dfe9ff] bg-[#f7f9ff] p-4 shadow-sm">
              <p className="text-sm font-medium text-[#64799a]">{label}</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.06em] text-[#1d2f45]">{loading ? "-" : value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1d2f45]">Upcoming trips</h3>
              <Link href="/trips/new" className="rounded-full bg-[#0d4ad5] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#dfeaff] transition hover:bg-[#0b3eb1]">
                + Create trip
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-[#64799a]">Loading trips...</p>
            ) : upcoming.length ? (
              <div className="space-y-3">
                {upcoming.map((trip) => (
                  <Link href={`/trips/${trip.id}`} key={trip.id} className="flex items-center justify-between rounded-2xl border border-[#dfe9ff] bg-white p-4 transition hover:border-[#bfd3ff] hover:shadow-sm">
                    <div>
                      <p className="font-semibold text-[#1d2f45]">{trip.title}</p>
                      <p className="text-sm text-[#64799a]">{destinationLabel(trip)} · {dateLabel(trip)}</p>
                    </div>
                    <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#0d4ad5]">{trip.status}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-[#dfe9ff] p-6 text-center text-sm text-[#64799a]">No upcoming trips yet.</p>
            )}
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(135deg,_#0d4ad5_0%,_#123ca0_100%)] p-5 text-white shadow-[0_20px_40px_rgba(13,74,213,0.28)]">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Discover</p>
            <h3 className="mt-3 text-2xl font-semibold leading-tight">Find your next destination</h3>
            <p className="mt-3 text-sm leading-6 text-blue-100/80">Browse popular places, trip-ready settings, and personalized travel ideas.</p>
            <Link href="/destinations" className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#123ca0] transition hover:bg-blue-50">
              Explore destinations
            </Link>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1d2f45]">Recent trips</h3>
            <Link href="/history" className="text-sm font-semibold text-[#0d4ad5]">View history</Link>
          </div>

          {recent.length ? (
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {recent.map((trip) => (
                <Link key={trip.id} href={`/trips/${trip.id}`} className="rounded-2xl border border-[#dfe9ff] bg-white p-4 shadow-sm transition hover:border-[#bfd3ff]">
                  <p className="font-semibold text-[#1d2f45]">{trip.title}</p>
                  <p className="mt-1 text-sm text-[#64799a]">{destinationLabel(trip)}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#64799a]">Completed trips will appear here.</p>
          )}
        </section>
      </div>
    </UserShell>
  );
}
