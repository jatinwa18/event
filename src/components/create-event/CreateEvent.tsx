import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearTheme } from "../../store/themeSlice";
import type { RootState } from "../../store/store";

import ThemeSelector from "../../components/ThemeSelector";
import GeoapifyMapPicker from "../../components/GeoapifyMapPicker"; // <- import your component


type EventPayload = {
  title: string;
  start: string | null;
  end: string | null;
  location: string;
  description: string;
  requireApproval: boolean;
  ticketsFree: boolean;
  ticketPrice: number | null;
  capacity: number | null;
  theme: string | null;
  bannerDataUrl: string | null;

  // NEW: lat/lng (optional)
  lat?: number | null;
  lng?: number | null;
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || "";
console.log("Geoapify key →", GEOAPIFY_KEY); 

export default function CreateEventPage() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.selectedTheme);

  // --- FORM STATE ---
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requireApproval, setRequireApproval] = useState(false);
  const [ticketsFree, setTicketsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);

  // NEW: lat/lng for selected place
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [errors, setErrors] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  




  // Validation
  useEffect(() => {
    if (start && end) {
      if (new Date(end) < new Date(start)) {
        setErrors("End time must be after start time.");
      } else setErrors(null);
    }
  }, [start, end]);

  // Banner upload
  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBannerDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeBanner() {
    setBannerDataUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  // Submit
  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!title.trim()) return setErrors("Please enter an event title.");
    if (!start || !end) return setErrors("Please choose start and end date/time.");
    if (errors) return;

    const payload: EventPayload = {
      title: title.trim(),
      start,
      end,
      location: location.trim(),
      description: description.trim(),
      requireApproval,
      ticketsFree,
      ticketPrice: ticketsFree ? 0 : ticketPrice,
      capacity,
      theme,
      bannerDataUrl,
      lat,
      lng,
    };

    setShowPreview(true);

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // THEME → FULL PAGE BACKGROUND STYLE
  const themeStylePage =
    theme === "Confetti"
      ? "bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-300"
      : theme === "Minimal"
      ? "bg-gray-100"
      : theme === "Dark"
      ? "bg-[#0f0f0f] text-white"
      : theme === "Neon"
      ? "bg-black text-[#39ff14]"
      : theme === "Ocean"
      ? "bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-700"
      : theme === "Sunset"
      ? "bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600"
      : theme === "Galaxy"
      ? "bg-gradient-to-br from-indigo-900 via-purple-800 to-black"
      : "bg-[#523444]"; // fallback

  const themeStyleBanner =
    theme === "Confetti"
      ? "bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300"
      : theme === "Minimal"
      ? "bg-gray-200"
      : theme === "Ocean"
      ? "bg-gradient-to-br from-blue-400 via-cyan-300 to-blue-600"
      : theme === "Sunset"
      ? "bg-gradient-to-br from-orange-400 via-pink-400 to-purple-500"
      : theme === "Galaxy"
      ? "bg-gradient-to-br from-indigo-800 via-purple-700 to-black"
      : "bg-gradient-to-br from-pink-400 via-red-500 to-yellow-400";

  return (
    <div className={`min-h-screen text-black p-6 md:p-12 ${themeStylePage}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-900">
        {/* LEFT COLUMN */}
        <div className="col-span-1">
          <div className="relative w-full">
            {/* Banner + THEME PREVIEW */}
            <div
              className={`h-64 w-full rounded-xl shadow-lg overflow-hidden flex items-center justify-center ${themeStyleBanner}`}
            >
              {bannerDataUrl ? (
                <img src={bannerDataUrl} className="object-cover h-full w-full" />
              ) : (
                <div className="text-gray-800 font-bold text-xl">Event Banner Preview</div>
              )}
            </div>

            {/* Upload */}
            <label
              className="
    absolute right-0 mt-7
    flex items-center gap-2
    px-2.5 py-2 rounded-full bg-yellow-100 cursor-pointer
    shadow hover:bg-yellow-200 transition
  "
            >
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={handleBannerChange}
                className="hidden"
              />
              <span className="text-lg">📂</span>
            </label>

            {/* Remove Banner */}
            {bannerDataUrl && (
              <button
                onClick={removeBanner}
                className="absolute left-3 mt-8 bg-white/90 px-3 py-1 rounded-md text-sm text-gray-800 z-50"
              >
                Remove
              </button>
            )}

            {/* THEME MINI BOX */}
            <div className="mt-24 p-3 rounded-lg bg-white/40 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-700">Theme</div>
                  <div className="text-base font-semibold">{theme ?? "Default"}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => dispatch(clearTheme())}
                    className="px-3 py-2 bg-white/50 rounded-md hover:bg-white/70 text-sm"
                  >
                    Clear
                  </button>

                  <button
                    onClick={() => setThemeOpen(true)}
                    className="px-3 py-2 bg-white/50 rounded-md hover:bg-white/70 text-sm"
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-4xl font-bold">Create Event</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Event Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-2 p-3 rounded-lg bg-white/60"
                  placeholder="My awesome event"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">Location</label>
                <input
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLat(null); setLng(null);
                  }}
                  placeholder="Search address..."
                  className="w-full mt-2 p-3 rounded-lg bg-white/60"
                />
              </div>
            </div>

            {/* MAP SECTION - full width below title/location inputs */}
            {location && (
              <div className="bg-white/40 p-4 rounded-lg">
                <div className="mt-2">
                  <GeoapifyMapPicker
                    apiKey={GEOAPIFY_KEY}
                    address={location}
                    onAddressChange={(v) => {
                      setLocation(v);
                      setLat(null); setLng(null);
                    }}
                    onSelectLocation={(latVal, lngVal, formatted) => {
                      setLat(latVal); setLng(lngVal); setLocation(formatted);
                    }}
                    country="in" 
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold">Start</label>
                <input
                  type="datetime-local"
                  value={start ?? ""}
                  onChange={(e) => setStart(e.target.value || null)}
                  className="w-full mt-2 p-3 rounded-lg bg-white/60"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">End</label>
                <input
                  type="datetime-local"
                  value={end ?? ""}
                  onChange={(e) => setEnd(e.target.value || null)}
                  className="w-full mt-2 p-3 rounded-lg bg-white/60"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mt-2 p-3 rounded-lg bg-white/60"
              />
            </div>

            <div className="bg-white/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-800 font-semibold">Require Approval</div>
                  <div className="text-xs text-gray-800">Attendees need host approval.</div>
                </div>

                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={requireApproval}
                    onChange={() => setRequireApproval((v) => !v)}
                    className="sr-only"
                    aria-label="Require approval"
                    style={{ position: "absolute", opacity: 0, pointerEvents: "auto" }}
                  />

                  <div
                    role="switch"
                    aria-checked={requireApproval}
                    style={{
                      width: 44,
                      height: 24,
                      borderRadius: 9999,
                      background: requireApproval ? "#6366F1" : "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                      padding: 2,
                      boxSizing: "border-box",
                      transition: "background 180ms ease",
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 9999,
                        background: "#ffffff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                        transform: requireApproval ? "translateX(20px)" : "translateX(0)",
                        transition: "transform 180ms ease",
                      }}
                    />
                  </div>

                  <span style={{ fontSize: 14, color: "#111" }}>{requireApproval ? "On" : "Off"}</span>
                </label>
              </div>

              {/* Ticket Section */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-semibold">Tickets</div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setTicketsFree(true)}
                      className={`px-3 py-2 rounded-md ${ticketsFree ? "bg-indigo-600 text-white" : "bg-white/50"}`}
                    >
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setTicketsFree(false)}
                      className={`px-3 py-2 rounded-md ${!ticketsFree ? "bg-indigo-600 text-white" : "bg-white/50"}`}
                    >
                      Paid
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold">Ticket Price</label>
                  <input
                    type="number"
                    min={0}
                    disabled={ticketsFree}
                    value={ticketPrice ?? ""}
                    onChange={(e) => setTicketPrice(e.target.value ? Number(e.target.value) : null)}
                    className="w-full mt-2 p-3 rounded-lg bg-white/60"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    value={capacity ?? ""}
                    onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : null)}
                    className="w-full mt-2 p-3 rounded-lg bg-white/60"
                    placeholder="Unlimited"
                  />
                </div>
              </div>
            </div>

            {errors && <div className="text-red-600">{errors}</div>}

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button type="submit" className="px-6 py-3 bg-[#3b2330] text-white rounded-lg font-semibold shadow">
                Create Event
              </button>

              <button
                type="button"
                onClick={() => {
                  setTitle("My Demo Party");
                  setStart(new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16));
                  setEnd(new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16));
                  setLocation("Virtual / Zoom");
                  setLat(null);
                  setLng(null);
                }}
                className="px-4 py-2 bg-white/50 rounded-lg"
              >
                Autofill
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* THEME SELECTOR */}
      <ThemeSelector open={themeOpen} onClose={() => setThemeOpen(false)} />

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-[90%] md:w-3/4 bg-white/20 p-6 rounded-xl backdrop-blur">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold">Event Preview</h2>
              <button onClick={() => setShowPreview(false)} className="px-3 py-1 bg-white/30 rounded">
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="h-40 rounded-md overflow-hidden bg-black/20">
                  {bannerDataUrl ? (
                    <img src={bannerDataUrl} className="h-full w-full" />
                  ) : (
                    <div className="p-4 text-gray-200">No banner</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 text-gray-900">
                <div className="text-xl font-semibold">{title}</div>
                <div className="text-sm mt-2">{description}</div>

                <div className="mt-4 text-sm">
                  <div>Start: {start}</div>
                  <div>End: {end}</div>
                  <div>Location: {location}</div>
                  <div>Theme: {theme ?? "None"}</div>
                  <div>Tickets: {ticketsFree ? "Free" : `Paid — ₹${ticketPrice}`}</div>
                  <div>Capacity: {capacity ?? "Unlimited"}</div>
                  <div>Require Approval: {requireApproval ? "Yes" : "No"}</div>
                  <div>Latitude: {lat ?? "—"}</div>
                  <div>Longitude: {lng ?? "—"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
