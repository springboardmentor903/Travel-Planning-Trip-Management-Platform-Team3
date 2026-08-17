import { UserShell } from "../components/user-shell";

export default function ProfilePage() {
  return (
    <UserShell
      title="Profile"
      description="Manage your personal travel identity and travel snapshot."
      activePage="Profile"
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-white">
              A
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Ariana Smith</h3>
              <p className="text-sm text-slate-500">Explorer • Remote worker</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-white p-3"><strong className="text-slate-900">Email:</strong> ariana@example.com</div>
            <div className="rounded-2xl bg-white p-3"><strong className="text-slate-900">Location:</strong> London, UK</div>
            <div className="rounded-2xl bg-white p-3"><strong className="text-slate-900">Languages:</strong> English, Spanish</div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-semibold text-slate-900">Travel persona</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              ["Preferred pace", "Balanced: mix of adventure and rest"],
              ["Top trip style", "Boutique stays and scenic routes"],
              ["Average trip length", "7-10 days"],
              ["Travel budget", "Mid-range"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-3 text-sm font-medium text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserShell>
  );
}
