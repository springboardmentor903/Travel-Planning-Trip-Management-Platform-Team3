import { UserShell } from "../components/user-shell";

const settings = [
  { label: "Notifications", value: "Enabled" },
  { label: "Privacy", value: "Friends only" },
  { label: "Default currency", value: "USD" },
  { label: "Booking reminders", value: "7 days before" },
  { label: "Theme", value: "Light" },
  { label: "Language", value: "English" },
];

export default function SettingsPage() {
  return (
    <UserShell
      title="Account Settings"
      description="Update your account preferences and notifications."
      activePage="Account Settings"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </UserShell>
  );
}
