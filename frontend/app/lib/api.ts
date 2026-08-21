export type Activity = { id: number; title: string; type?: string; startTime?: string; endTime?: string; location?: string; notes?: string };
export type Day = { id: number; dayNumber: number; date?: string; notes?: string; activities: Activity[] };
export type Trip = { id: number; title: string; destination: string; startDate?: string; endDate?: string; description?: string; budget?: number; status: string; days: Day[] };
export type Destination = { id: string; name: string; country: string; description: string; weather?: { temperature: string; condition: string; source: string }; highlights?: string[] };
export type UserProfile = { id?: number; name: string; email: string; location?: string; languages?: string[]; preferences?: Record<string, string | string[]>; favoriteDestinations?: Destination[] };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

function session() {
  if (typeof window === "undefined") return { token: "", email: "" };
  return { token: localStorage.getItem("tripnest_token") || "", email: localStorage.getItem("tripnest_email") || "" };
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { token, email } = session();
  const separator = path.includes("?") ? "&" : "?";
  const needsEmail = Boolean(email) && (path.startsWith("/trips") || path.startsWith("/users"));
  const response = await fetch(`${API_URL}${path}${needsEmail ? `${separator}email=${encodeURIComponent(email)}` : ""}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) throw new Error((await response.text()) || `Request failed (${response.status})`);
  return response.status === 204 ? (undefined as T) : response.json();
}

export function saveSession(email: string, token: string | null) { localStorage.setItem("tripnest_email", email); if (token) localStorage.setItem("tripnest_token", token); }
export function clearSession() { localStorage.removeItem("tripnest_email"); localStorage.removeItem("tripnest_token"); }