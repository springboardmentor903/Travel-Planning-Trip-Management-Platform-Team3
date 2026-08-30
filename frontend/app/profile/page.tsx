"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, UserProfile } from "../lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<UserProfile>("/users/me")
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setLocation(data.location || "");
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Profile could not be loaded."));
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setStatus("");

    try {
      const updated = await api<UserProfile>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name, location }),
      });
      setProfile(updated);
      setStatus("Profile updated");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Profile could not be updated.");
    }
  }

  return (
    <UserShell title="Profile" description="Manage your personal travel identity and travel snapshot." activePage="Profile">
      <div className="mb-5 space-y-3">
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {status && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p>}
      </div>

      {profile ? (
        <form onSubmit={save} className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <section className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,_#0d4ad5_0%,_#123ca0_100%)] text-2xl font-bold text-white">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1d2f45]">{profile.name}</h3>
                <p className="text-sm text-[#64799a]">{profile.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#53667e]">
              <div className="rounded-2xl bg-white p-3">
                <strong className="text-[#1d2f45]">Email:</strong> {profile.email}
              </div>
              <div className="rounded-2xl bg-white p-3">
                <strong className="text-[#1d2f45]">Location:</strong> {profile.location || "Not provided"}
              </div>
              <div className="rounded-2xl bg-white p-3">
                <strong className="text-[#1d2f45]">Languages:</strong> {profile.languages?.join(", ") || "Not provided"}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1d2f45]">Edit personal details</h3>

            <label className="mt-5 block text-sm font-medium text-[#53667e]">
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#dfe9ff] bg-white px-3 py-3 text-[#1d2f45] outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
              />
            </label>

            <label className="mt-4 block text-sm font-medium text-[#53667e]">
              Location
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#dfe9ff] bg-white px-3 py-3 text-[#1d2f45] outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
              />
            </label>

            <button className="mt-5 rounded-full bg-[#0d4ad5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#dfeaff] transition hover:bg-[#0b3eb1]">
              Save changes
            </button>
          </section>
        </form>
      ) : (
        <p className="text-sm text-[#64799a]">Loading profile...</p>
      )}
    </UserShell>
  );
}
