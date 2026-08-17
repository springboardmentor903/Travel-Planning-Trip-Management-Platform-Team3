import { UserShell } from "../components/user-shell";

const preferences = [
  { label: "Ideal climate", value: "Warm, mild weather" },
  { label: "Travel style", value: "Relaxed luxury" },
  { label: "Accommodation", value: "Boutique hotels" },
  { label: "Activities", value: "Hiking, dining, culture" },
  { label: "Budget range", value: "$800 - $1,800" },
  { label: "Travel season", value: "Spring and early autumn" },
];

export default function PreferencesPage() {
  return (
    <UserShell
      title="Travel Preferences"
      description="Customize the destinations and experiences you prefer most."
      activePage="Travel Preferences"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {preferences.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </UserShell>
  );
}
