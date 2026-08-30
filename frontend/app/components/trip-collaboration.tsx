"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  getTripMembers,
  inviteTripMember,
  removeTripMember,
  TripMember,
  updateTripMemberRole,
} from "../lib/api";

type Props = { tripId: number; ownerEmail?: string };

const roleLabel: Record<TripMember["role"], string> = {
  OWNER: "Trip owner",
  GROUP_ADMIN: "Group admin",
  MEMBER: "Member",
};

export function TripCollaboration({ tripId, ownerEmail }: Props) {
  const [members, setMembers] = useState<TripMember[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const currentEmail = typeof window === "undefined" ? "" : localStorage.getItem("tripnest_email") || "";
  const currentMember = useMemo(
    () => members.find((member) => member.email.toLowerCase() === currentEmail.toLowerCase()),
    [currentEmail, members],
  );
  const canManage = ownerEmail?.toLowerCase() === currentEmail.toLowerCase()
    || currentMember?.role === "OWNER"
    || currentMember?.role === "GROUP_ADMIN";

  async function loadMembers() {
    setLoading(true);
    try {
      setMembers(await getTripMembers(tripId));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Members could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadMembers(), 0);
    return () => window.clearTimeout(timer);
    // The member list is refreshed when its trip changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function invite(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!email.trim()) return;
    try {
      await inviteTripMember(tripId, email.trim());
      setEmail("");
      setMessage("Member added successfully.");
      await loadMembers();
    } catch (reason) {
      const detail = reason instanceof Error ? reason.message : "The invitation could not be sent.";
      setError(/not found|does not exist|unknown user/i.test(detail)
        ? "No account exists for that email address. Ask them to register first."
        : /already|duplicate|member exists/i.test(detail)
          ? "That user is already a member of this trip."
          : detail);
    }
  }

  async function changeRole(member: TripMember, role: "GROUP_ADMIN" | "MEMBER") {
    setError("");
    try {
      await updateTripMemberRole(tripId, member.id, role);
      setMessage(`${member.name}'s role was updated.`);
      await loadMembers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The member role could not be updated.");
    }
  }

  async function removeMember(member: TripMember) {
    if (!confirm(`Remove ${member.name} from this trip? They will lose access to its modules.`)) return;
    setError("");
    try {
      await removeTripMember(tripId, member.id);
      setMessage(`${member.name} was removed from this trip.`);
      await loadMembers();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The member could not be removed.");
    }
  }

  return (
    <section className="mt-8 border-t border-[#edf4ff] pt-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d82a3]">Collaboration</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#1d2f45]">Trip members</h3>
          <p className="mt-1 text-sm text-[#64799a]">Members can access trip management, itinerary, activities, budgets, and expenses.</p>
        </div>
        {currentMember && <span className="rounded-full bg-[#edf4ff] px-3 py-1.5 text-xs font-semibold text-[#0d4ad5]">Your role: {roleLabel[currentMember.role]}</span>}
      </div>

      {(error || message) && <p className={`mb-4 rounded-2xl border p-3 text-sm ${error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{error || message}</p>}

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-[#1d2f45]">Members</h4>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#64799a]">{members.length} total</span>
          </div>
          {loading ? <p className="text-sm text-[#64799a]">Loading members…</p> : (
            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-[#1d2f45]">{member.name}</p><p className="truncate text-xs text-[#64799a]">{member.email}</p></div>
                  <div className="flex items-center gap-2">
                    {canManage && member.role !== "OWNER" ? (
                      <select value={member.role} onChange={(event) => void changeRole(member, event.target.value as "GROUP_ADMIN" | "MEMBER")} className="rounded-lg border border-[#dfe9ff] bg-white px-2 py-1.5 text-xs font-semibold text-[#53667e]">
                        <option value="MEMBER">Member</option><option value="GROUP_ADMIN">Group admin</option>
                      </select>
                    ) : <span className="rounded-full bg-[#edf4ff] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0d4ad5]">{roleLabel[member.role]}</span>}
                    {canManage && member.role !== "OWNER" && <button type="button" onClick={() => void removeMember(member)} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>}
                  </div>
                </div>
              ))}
              {!members.length && <p className="rounded-2xl bg-white p-4 text-center text-sm text-[#64799a]">No members were returned for this trip.</p>}
            </div>
          )}
        </div>

        {canManage ? (
          <form onSubmit={invite} className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1d2f45]">Invite a member</h4>
            <p className="mt-2 text-sm text-[#64799a]">Add an existing TripNest user by email.</p>
            <label className="mt-4 block text-sm font-medium text-[#53667e]">Email address
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="member@email.com" className="mt-2 w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]" />
            </label>
            <button className="mt-4 w-full rounded-full bg-[#0d4ad5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#dfeaff] hover:bg-[#0b3eb1]">Add member</button>
          </form>
        ) : <div className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 text-sm text-[#64799a] shadow-sm">Only the trip owner and group admins can invite members, change roles, or remove access.</div>}
      </div>
    </section>
  );
}
