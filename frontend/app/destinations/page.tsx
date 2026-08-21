"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, Destination } from "../lib/api";

export default function DestinationsPage() {
  const [query, setQuery] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function search(event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(query.trim().length > 0);

    try {
      const results = await api<Destination[]>(`/destinations?query=${encodeURIComponent(query.trim())}`);
      setDestinations(results);
    } catch (reason) {
      setDestinations([]);
      setError(reason instanceof Error ? reason.message : "Destinations could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void search();
  }, []);

  return (
    <UserShell title="Destinations" description="Find a place that matches the way you want to travel." activePage="Destinations">
      <section className="rounded-2xl bg-[#173f45] p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a6ddd2]">Explore the world</p>
        <h3 className="mt-2 max-w-xl text-2xl font-semibold">Search places worth building a trip around.</h3>
        <form onSubmit={search} className="mt-5 flex flex-col gap-2 sm:flex-row">
          <label className="sr-only" htmlFor="destination-search">Search destinations</label>
          <input id="destination-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search cities, countries, or regions" className="min-w-0 flex-1 rounded-xl border border-white/20 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-[#9dd6ca]" />
          <button type="submit" className="rounded-xl bg-[#a8d9d3] px-5 py-3 font-semibold text-[#173f45] transition hover:bg-white">{loading ? "Searching..." : "Search"}</button>
        </form>
      </section>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b8a88]">{hasSearched ? "Search results" : "Popular destinations"}</p>
          <h3 className="mt-1 text-2xl font-semibold text-slate-900">{hasSearched ? `Places matching “${query.trim()}”` : "Start with a favorite"}</h3>
        </div>
        {hasSearched && <button type="button" onClick={() => { setQuery(""); void search(); }} className="text-sm font-semibold text-[#396c68]">Show popular</button>}
      </div>

      {error && <div className="mt-5 flex flex-col gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"><p>We could not reach the destination service. {error}</p><button type="button" onClick={() => void search()} className="font-semibold underline">Try again</button></div>}

      {loading ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2" aria-label="Loading destinations">{[1, 2, 3, 4].map((card) => <div key={card} className="h-44 animate-pulse rounded-2xl bg-slate-100" />)}</div>
      ) : destinations.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {destinations.map((destination) => <Link key={destination.id} href={`/destinations/${destination.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#9bcfc7] hover:shadow-md"><div className="flex items-start justify-between gap-4"><div><p className="text-xl font-semibold text-slate-900 group-hover:text-[#396c68]">{destination.name}</p><p className="mt-1 text-sm text-slate-500">{destination.country}</p></div><span className="text-lg text-[#6b8a88]" aria-hidden="true">↗</span></div><p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{destination.description || "Explore this destination and get the details you need to plan your visit."}</p></Link>)}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-10 text-center"><p className="font-semibold text-slate-800">No destinations found</p><p className="mt-2 text-sm text-slate-500">Try a broader city, country, or region search.</p></div>
      )}
    </UserShell>
  );
}
