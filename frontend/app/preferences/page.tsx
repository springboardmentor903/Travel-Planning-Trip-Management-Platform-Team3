"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, UserProfile } from "../lib/api";

const fields = ["preferredDestinations", "travelType", "climate", "accommodation", "activities", "budgetRange"];
export default function PreferencesPage() {
  const [values, setValues] = useState<Record<string, string>>({}); const [error, setError] = useState(""); const [status, setStatus] = useState("");
  useEffect(() => { api<UserProfile>("/users/me/preferences").then((data) => setValues(Object.fromEntries(fields.map((field) => [field, String(data.preferences?.[field] || "")])))).catch((reason) => setError(reason instanceof Error ? reason.message : "Preferences could not be loaded.")); }, []);
  async function save(event: FormEvent) { event.preventDefault(); try { await api("/users/me/preferences", { method: "PUT", body: JSON.stringify(values) }); setStatus("Preferences updated"); } catch (reason) { setError(reason instanceof Error ? reason.message : "Preferences could not be updated."); } }
  return <UserShell title="Travel Preferences" description="Customize the destinations and experiences you prefer most." activePage="Travel Preferences"><div className="mb-5 space-y-2">{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}{status && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p>}</div><form onSubmit={save} className="grid gap-4 md:grid-cols-2">{fields.map((field) => <label key={field} className="text-sm font-medium capitalize text-slate-600">{field.replace(/([A-Z])/g, " $1")}<input value={values[field] || ""} onChange={(event) => setValues({ ...values, [field]: event.target.value })} placeholder="Not set" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5" /></label>)}<button className="rounded-xl bg-[#173f45] px-4 py-2.5 text-sm font-semibold text-white md:col-span-2">Save preferences</button></form></UserShell>;
}
