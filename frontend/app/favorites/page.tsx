import { UserShell } from "../components/user-shell";

const favorites = [
  { name: "Kyiv", note: "Historic architecture and café culture" },
  { name: "Lisbon", note: "Sunset viewpoints and coastal walks" },
  { name: "Bali", note: "Nature, wellness, and relaxed beach stays" },
  { name: "Reykjavík", note: "Epic landscapes and geothermal experiences" },
];

export default function FavoritesPage() {
  return (
    <UserShell
      title="Favourite Destinations"
      description="Your saved dream destinations and future inspiration board."
      activePage="Favourite Destinations"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {favorites.map((place) => (
          <div key={place.name} className="rounded-3xl border border-slate-200 bg-gradient-to-br from-cyan-50 to-white p-5">
            <p className="text-xl font-semibold text-slate-900">{place.name}</p>
            <p className="mt-3 text-sm text-slate-600">{place.note}</p>
            <button className="mt-5 rounded-full bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700">
              View destination
            </button>
          </div>
        ))}
      </div>
    </UserShell>
  );
}
