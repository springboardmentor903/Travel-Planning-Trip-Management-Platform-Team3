"use client";

import { FormEvent, useEffect, useState } from "react";
import { UserShell } from "../components/user-shell";
import { api, UserProfile } from "../lib/api";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api<UserProfile>("/users/me")
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Account settings could not be loaded."));
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setStatus("");

    try {
      await api<UserProfile>("/users/me", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });
      setStatus("Account information updated");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Account information could not be updated.");
    }
  }

  return (
    <UserShell title="Account Settings" description="Update account information and manage your travel settings." activePage="Account Settings">
      <div className="space-y-5">
        {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {status && <p className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{status}</p>}

        {profile ? (
          <>
            <form onSubmit={save} className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1d2f45]">Account information</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-[#53667e]">
                  Name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#dfe9ff] bg-white px-3 py-3 text-[#1d2f45] outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                  />
                </label>

                <label className="text-sm font-medium text-[#53667e]">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-[#dfe9ff] bg-white px-3 py-3 text-[#1d2f45] outline-none transition focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                  />
                </label>
              </div>
              <button className="mt-5 rounded-full bg-[#0d4ad5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#dfeaff] transition hover:bg-[#0b3eb1]">
                Save account
              </button>
            </form>

            <div className="rounded-[28px] border border-[#dfe9ff] bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1d2f45]">Other settings</h3>
              <p className="mt-2 text-sm text-[#64799a]">
                Password, notification, language, and currency controls will appear when their backend endpoints are available.
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f7f9ff] p-3 text-sm text-[#53667e]">Notifications: Backend controlled</div>
                <div className="rounded-2xl bg-[#f7f9ff] p-3 text-sm text-[#53667e]">Privacy: Backend controlled</div>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-[#64799a]">Loading account settings...</p>
        )}
      </div>
    </UserShell>
  );
}
