"use client";

import { FormEvent, useState } from "react";
import { UserShell } from "../../components/user-shell";
import { requestToJoinTrip, searchTripsByName, TripSearchResult } from "../../lib/api";

export default function JoinTripPage() {
  const [name, setName] = useState("");
  const [trips, setTrips] = useState<TripSearchResult[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [requestingId, setRequestingId] = useState<number | null>(null);

  async function search(event: FormEvent) {
    event.preventDefault();
    const query = name.trim();
    if (!query) return;
    setSearching(true); setError(""); setMessage("");
    try { setTrips(await searchTripsByName(query)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Trips could not be searched."); }
    finally { setSearching(false); }
  }

  async function requestAccess(trip: TripSearchResult) {
    setRequestingId(trip.id); setError(""); setMessage("");
    try {
      await requestToJoinTrip(trip.id);
      setMessage(`Your request to join “${trip.title}” was sent to its trip admin.`);
    } catch (reason) {
      const detail = reason instanceof Error ? reason.message : "Your join request could not be sent.";
      setError(/already|pending/i.test(detail) ? "You already have a pending request or are a member of this trip." : detail);
    } finally { setRequestingId(null); }
  }

  return (
    <UserShell title="Join a trip" description="Search shared trips and send a request to the trip administrator." activePage="Join a Trip">
      <form onSubmit={search} className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
        <label className="block text-sm font-semibold text-[#53667e]">Trip name
          <div className="mt-2 flex flex-col gap-2 sm:flex-row"><input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Search by trip name" className="min-w-0 flex-1 rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]" /><button disabled={searching} className="rounded-full bg-[#0d4ad5] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{searching ? "Searching…" : "Search trips"}</button></div>
        </label>
      </form>
      {(error || message) && <p className={`mt-5 rounded-2xl border p-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</p>}
      <div className="mt-6 space-y-3">
        {trips.map((trip) => <article key={trip.id} className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-[#dfe9ff] bg-white p-5 shadow-sm"><div><h2 className="text-lg font-semibold text-[#1d2f45]">{trip.title}</h2><p className="mt-1 text-sm text-[#64799a]">{trip.destination || "Destination not specified"}{trip.ownerName ? ` · Admin: ${trip.ownerName}` : ""}</p></div><button onClick={() => void requestAccess(trip)} disabled={requestingId === trip.id} className="rounded-full border border-[#bfd3ff] bg-[#edf4ff] px-4 py-2 text-sm font-semibold text-[#0d4ad5] disabled:opacity-60">{requestingId === trip.id ? "Sending…" : "Request to join"}</button></article>)}
        {!searching && name && !trips.length && !error && <p className="rounded-2xl bg-[#f7f9ff] p-5 text-center text-sm text-[#64799a]">Search for a trip name to find shared trips.</p>}
      </div>
    </UserShell>
  );
}
