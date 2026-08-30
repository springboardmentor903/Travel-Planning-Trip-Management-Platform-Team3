"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api, Trip } from "../lib/api";
import { UserShell } from "../components/user-shell";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Trip[]>("/trips/my")
      .then(setTrips)
      .catch((e) => setError(e.message));
  }, []);

  const upcoming = trips.filter((trip) => !["COMPLETED", "CANCELLED"].includes(String(trip.status))).length;
  const active = trips.filter((trip) => String(trip.status) === "IN_PROGRESS").length;

  return (
    <UserShell title="My trips" description="Keep every route, reservation, and idea in one place." activePage="My Trips">
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Saved trips", value: trips.length },
            { label: "Upcoming", value: upcoming },
            { label: "In progress", value: active },
          ].map((item) => (
            <div key={item.label} className="rounded-[24px] border border-[#dfe9ff] bg-[#f7f9ff] p-4 shadow-sm">
              <p className="text-sm font-medium text-[#64799a]">{item.label}</p>
              <p className="mt-3 text-3xl font-bold tracking-[-0.06em] text-[#1d2f45]">{item.value}</p>
            </div>
          ))}
        </section>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[#64799a]">{trips.length} saved trips</p>
          <Link className="rounded-full bg-[#0d4ad5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#dfeaff] transition hover:bg-[#0b3eb1]" href="/trips/new">
            + New trip
          </Link>
        </div>

        {error && (
          <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}. Start the backend and sign in again.</p>
        )}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {trips.map((trip) => (
            <Link
              key={trip.id}
              href={`/trips/${trip.id}`}
              className="group rounded-[26px] border border-[#dfe9ff] bg-[linear-gradient(135deg,_#ffffff_0%,_#f7f9ff_100%)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#bfd3ff] hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d82a3]">{trip.status}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#1d2f45]">{trip.title}</h3>
                </div>
                <span className="rounded-full bg-[#edf4ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0d4ad5]">
                  {String(trip.status).replace("_", " ")}
                </span>
              </div>

              <p className="mt-4 text-sm text-[#53667e]">
                {typeof trip.destination === "string" ? trip.destination : trip.destination?.name || "Destination"}
              </p>

              <div className="mt-5 rounded-2xl bg-[#edf4ff] p-3 text-sm text-[#3554a6]">
                <span className="font-medium">Dates:</span> {trip.startDate || "Date to be decided"}
                {trip.endDate ? ` - ${trip.endDate}` : ""}
              </div>
            </Link>
          ))}
        </div>

        {!error && trips.length === 0 && (
          <div className="mt-8 rounded-[26px] border border-dashed border-[#dfe9ff] bg-[#f7f9ff] p-10 text-center text-[#64799a]">
            No trips yet. Create your first plan.
          </div>
        )}
      </div>
    </UserShell>
  );
}