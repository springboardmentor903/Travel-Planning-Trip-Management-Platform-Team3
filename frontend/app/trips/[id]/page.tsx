"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  api,
  Budget,
  Expense,
  Trip,
  CategorySummaryItem,
  getBudget,
  createBudget,
  updateBudget,
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getCategorySummary,
  getRemainingBudget,
} from "../../lib/api";
import { UserShell } from "../../components/user-shell";
import { CategorySpendingChart } from "../../components/category-spending-chart";
import { TripCollaboration } from "../../components/trip-collaboration";

const categoryOptions = ["Transportation", "Hotel", "Food", "Shopping", "Entertainment", "Miscellaneous"];
const categoryColors: Record<string, string> = {
  Transportation: "#f87171",
  Hotel: "#fb923c",
  Food: "#fbbf24",
  Shopping: "#60a5fa",
  Entertainment: "#a78bfa",
  Miscellaneous: "#cbd5e1",
};

const emptyExpense = { category: "Food", amount: "", date: "", receiptLink: "" };

function getDestinationId(trip: Trip | null) {
  if (!trip) return 1;
  return typeof trip.destination === "object" ? trip.destination?.id ?? trip.destinationId ?? 1 : trip.destinationId ?? 1;
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const tripId = Number(id);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [remainingBudget, setRemainingBudget] = useState<number | null>(null);
  const [categorySummary, setCategorySummary] = useState<CategorySummaryItem[]>([]);
  const [budgetForm, setBudgetForm] = useState({ amount: "", currency: "INR" });
  const [expenseForm, setExpenseForm] = useState(emptyExpense);
  const [editingExpenseId, setEditingExpenseId] = useState<number | null>(null);
  const [editingTrip, setEditingTrip] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    try {
      const tripData = await api<Trip>(`/trips/${tripId}`);
      setTrip(tripData);

      try {
        const budgetData = await getBudget(tripId);
        setBudget(budgetData);
        setBudgetForm({
          amount: String(budgetData.amount ?? ""),
          currency: budgetData.currency || "INR",
        });
      } catch {
        setBudget(null);
      }

      const expensesData = await getExpenses(tripId);
      setExpenses(expensesData || []);

      const summaryData = await getCategorySummary(tripId);
      const normalized = (summaryData || []).map((item) =>
        Array.isArray(item)
          ? { category: item[0] || "Miscellaneous", total: Number(item[1] || 0) }
          : { category: item.category || "Miscellaneous", total: Number(item.total || 0) },
      );
      setCategorySummary(normalized);

      try {
        const remainingData = await getRemainingBudget(tripId);
        setRemainingBudget(Number(remainingData));
      } catch {
        setRemainingBudget(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!tripId) return;
    const timer = window.setTimeout(() => void loadAllData(), 0);
    return () => window.clearTimeout(timer);
    // Data should refresh only when the route parameter changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  async function saveTrip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      title: String(formData.get("title") || trip?.title || ""),
      destinationId: Number(formData.get("destinationId") || getDestinationId(trip)),
      startDate: String(formData.get("startDate") || trip?.startDate || ""),
      endDate: String(formData.get("endDate") || trip?.endDate || ""),
      status: String(formData.get("status") || trip?.status || "PLANNED"),
      description: String(formData.get("description") || trip?.description || ""),
    };

    try {
      await api(`/trips/${tripId}`, { method: "PUT", body: JSON.stringify(payload) });
      setEditingTrip(false);
      setStatus("✓ Trip updated successfully");
      setTimeout(() => setStatus(""), 3000);
      void loadAllData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update trip");
    }
  }

  async function saveBudget() {
    if (!budgetForm.amount) {
      setError("Please enter a budget amount");
      return;
    }

    const payload = { amount: Number(budgetForm.amount), currency: budgetForm.currency };
    try {
      if (budget?.id) {
        await updateBudget(tripId, payload);
      } else {
        await createBudget(tripId, payload);
      }
      setStatus("✓ Budget saved successfully");
      setTimeout(() => setStatus(""), 3000);
      void loadAllData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save budget");
    }
  }

  async function saveExpense(e: FormEvent) {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.date) {
      setError("Please fill in amount and date");
      return;
    }

    try {
      const payload = {
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        date: expenseForm.date,
        receiptLink: expenseForm.receiptLink || "",
      };

      if (editingExpenseId) {
        await updateExpense(editingExpenseId, payload);
        setStatus("✓ Expense updated");
      } else {
        await createExpense(tripId, payload);
        setStatus("✓ Expense added");
      }

      setExpenseForm(emptyExpense);
      setEditingExpenseId(null);
      setTimeout(() => setStatus(""), 3000);
      void loadAllData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save expense");
    }
  }

  async function handleDeleteExpense(expenseId: number) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      await deleteExpense(expenseId);
      setStatus("✓ Expense removed");
      setTimeout(() => setStatus(""), 3000);
      void loadAllData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete expense");
    }
  }

  if (loading) {
    return (
      <UserShell title="Trip details" description="Loading your trip..." activePage="My Trips">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#dfe9ff] border-t-[#0d4ad5]" />
            <p className="text-[#64799a]">Loading trip details...</p>
          </div>
        </div>
      </UserShell>
    );
  }

  if (!trip) {
    return (
      <UserShell title="Trip details" description="Trip not found" activePage="My Trips">
        <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">Could not load trip details. {error}</p>
      </UserShell>
    );
  }

  const destinationName = typeof trip.destination === "string" ? trip.destination : trip.destination?.name || "Destination";
  const totalBudget = budget ? Number(budget.amount) : 0;
  const amountSpent = remainingBudget === null ? expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0) : totalBudget - remainingBudget;

  return (
    <UserShell title={trip.title} description={`${destinationName}${trip.startDate ? ` · ${trip.startDate}` : ""}`} activePage="My Trips">
      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {status && <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 font-medium text-emerald-700">{status}</div>}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#0d4ad5]">{trip.status}</span>
          <p className="mt-4 max-w-2xl text-[#53667e]">{trip.description || "No description yet."}</p>
        </div>
        <button onClick={() => setEditingTrip((v) => !v)} className="rounded-full border border-[#dfe9ff] bg-white px-4 py-2 text-sm font-semibold text-[#1d2f45] transition hover:bg-[#f7f9ff]">
          {editingTrip ? "Close editor" : "Edit trip"}
        </button>
      </div>

      {editingTrip && (
        <form onSubmit={saveTrip} className="mb-6 grid gap-3 rounded-[26px] border border-[#dfe9ff] bg-[#f7f9ff] p-4 md:grid-cols-2">
          <label className="text-sm text-[#53667e]">
            Trip name
            <input name="title" defaultValue={trip.title} className="mt-1 w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]" />
          </label>
          <label className="text-sm text-[#53667e]">
            Destination ID
            <input name="destinationId" type="number" defaultValue={String(getDestinationId(trip))} className="mt-1 w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]" />
          </label>
          <label className="text-sm text-[#53667e]">
            Start date
            <input name="startDate" type="date" defaultValue={trip.startDate || ""} className="mt-1 w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]" />
          </label>
          <label className="text-sm text-[#53667e]">
            End date
            <input name="endDate" type="date" defaultValue={trip.endDate || ""} className="mt-1 w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]" />
          </label>
          <label className="text-sm text-[#53667e] md:col-span-2">
            Status
            <select name="status" defaultValue={trip.status} className="mt-1 w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]">
              <option value="PLANNED">PLANNED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </label>
          <textarea name="description" defaultValue={trip.description || ""} placeholder="Description" className="rounded-xl border border-[#dfe9ff] bg-white p-2 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff] md:col-span-2" rows={3} />
          <button type="submit" className="rounded-full bg-[#0d4ad5] px-4 py-2.5 font-semibold text-white md:col-span-2 hover:bg-[#0b3eb1]">
            Save changes
          </button>
        </form>
      )}

      <section className="mt-8 border-t border-[#edf4ff] pt-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d82a3]">Budget & Expenses</p>
          <h3 className="mt-1 text-2xl font-semibold text-[#1d2f45]">Budget management and tracking</h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1d2f45]">Set budget</h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px]">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#64799a]">Amount</label>
                <input
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm((prev) => ({ ...prev, amount: e.target.value }))}
                  type="number"
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#64799a]">Currency</label>
                <select
                  value={budgetForm.currency}
                  onChange={(e) => setBudgetForm((prev) => ({ ...prev, currency: e.target.value }))}
                  className="w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
            <button onClick={saveBudget} className="mt-4 w-full rounded-full bg-[#0d4ad5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#dfeaff] transition hover:bg-[#0b3eb1]">
              {budget ? "Update budget" : "Create budget"}
            </button>

            <div className="mt-6 rounded-[22px] border border-[#dfe9ff] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64799a]">Total Budget</p>
              <p className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#1d2f45]">
                {budget ? `${budgetForm.currency || "INR"} ${Number(budget.amount).toLocaleString()}` : "Not set"}
              </p>
            </div>

            <div className="mt-3 rounded-[22px] border border-[#dfe9ff] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64799a]">Amount Spent</p>
              <p className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#d14343]">
                {budget ? `${budget.currency || "INR"} ${amountSpent.toLocaleString()}` : "—"}
              </p>
            </div>

            <div className="mt-3 rounded-[22px] bg-[#edf4ff] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0d4ad5]">Remaining</p>
              <p className="mt-2 text-3xl font-bold tracking-[-0.05em] text-[#123ca0]">
                {remainingBudget !== null ? `${budget?.currency || "INR"} ${remainingBudget.toLocaleString()}` : "—"}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <h4 className="text-lg font-semibold text-[#1d2f45]">Expenses by category</h4>
            <div className="mt-4 space-y-3">
              {categorySummary.length > 0 ? (
                <>
                  <CategorySpendingChart items={categorySummary} colors={categoryColors} currency={budget?.currency || budgetForm.currency} />
                  <p className="text-center text-xs text-[#64799a]">Live spending totals from the category-summary API.</p>
                </>
              ) : (
                <p className="rounded-2xl bg-white p-3 text-center text-sm text-[#64799a]">No expenses recorded yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-semibold text-[#1d2f45]">Expense entries</h4>
              <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#64799a]">{expenses.length} total</span>
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {expenses.length > 0 ? (
                expenses.map((expense) => (
                  <div key={expense.id} className="rounded-2xl border border-[#dfe9ff] bg-white p-3 shadow-sm transition hover:shadow-md">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[String(expense.category)] || "#cbd5e1" }} />
                          <p className="truncate font-semibold text-[#1d2f45]">{expense.category}</p>
                        </div>
                        <p className="mt-1 text-xs text-[#64799a]">
                          {expense.date} · Paid by {expense.payer?.name || expense.payer?.email || "You"}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-bold text-[#1d2f45]">{budget?.currency || "INR"} {Number(expense.amount).toLocaleString()}</p>
                        <div className="mt-1.5 flex gap-1.5 text-xs font-medium">
                          <button
                            onClick={() => {
                              setEditingExpenseId(Number(expense.id));
                              setExpenseForm({
                                category: String(expense.category || "Food"),
                                amount: String(expense.amount || ""),
                                date: String(expense.date || ""),
                                receiptLink: expense.receiptLink || "",
                              });
                            }}
                            className="text-[#0d4ad5] hover:underline"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteExpense(Number(expense.id))} className="text-red-600 hover:underline">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl bg-white p-4 text-center text-sm text-[#64799a]">No expenses yet. Add one to get started!</p>
              )}
            </div>
          </div>

          <form onSubmit={saveExpense} className="rounded-[28px] border border-[#dfe9ff] bg-[#f7f9ff] p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-[#1d2f45]">{editingExpenseId ? "Edit expense" : "Record expense"}</h4>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64799a]">Category</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-sm text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64799a]">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-sm text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64799a]">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-sm text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-[#64799a]">Receipt link (optional)</label>
                <input
                  type="url"
                  value={expenseForm.receiptLink}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, receiptLink: e.target.value }))}
                  placeholder="https://example.com/receipt"
                  className="w-full rounded-xl border border-[#dfe9ff] bg-white px-3 py-2.5 text-sm text-[#1d2f45] outline-none focus:border-[#7ea5ff] focus:ring-4 focus:ring-[#dfeaff]"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="submit" className="flex-1 rounded-full bg-[#0d4ad5] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#dfeaff] transition hover:bg-[#0b3eb1]">
                {editingExpenseId ? "Update" : "Add expense"}
              </button>
              {editingExpenseId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpenseId(null);
                    setExpenseForm(emptyExpense);
                  }}
                  className="rounded-full border border-[#dfe9ff] bg-white px-4 py-2.5 text-sm font-semibold text-[#1d2f45] hover:bg-[#f7f9ff]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <TripCollaboration tripId={tripId} ownerEmail={trip.owner?.email} />
    </UserShell>
  );
}
