"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, Destination } from "../lib/api";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Destination[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Destination[]>("/users/me/favorites")
      .then(setFavorites)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Favourite destinations could not be loaded."));
  }, []);

  async function remove(id: string | number) {
    try {
      await api(`/users/me/favorites/${encodeURIComponent(String(id))}`, { method: "DELETE" });
      setFavorites((items) => items.filter((item) => String(item.id) !== String(id)));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Favourite could not be removed.");
    }
  }

  return <UserShell title="Favourite Destinations" description="Your saved dream destinations and future inspiration board." activePage="Favourite Destinations">{error && <p className="mb-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{favorites.length ? <div className="grid gap-4 md:grid-cols-2">{favorites.map((place) => <div key={String(place.id)} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-xl font-semibold text-slate-900">{place.name}</p><p className="mt-1 text-sm text-slate-500">{place.country}</p><p className="mt-3 text-sm text-slate-600">{place.description}</p><div className="mt-5 flex gap-3"><Link href={`/destinations/${place.id}`} className="rounded-xl bg-[#173f45] px-3 py-2 text-sm font-medium text-white">View destination</Link><button onClick={() => void remove(place.id)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-red-700">Remove</button></div></div>)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center"><p className="font-semibold text-slate-800">No favourite destinations yet</p><Link href="/destinations" className="mt-3 inline-block text-sm font-semibold text-[#396c68]">Browse destinations</Link></div>}</UserShell>;
}
