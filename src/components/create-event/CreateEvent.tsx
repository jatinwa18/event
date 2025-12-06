import React, { useEffect, useRef, useState } from "react";

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
};

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requireApproval, setRequireApproval] = useState(false);
  const [ticketsFree, setTicketsFree] = useState(true);
  const [ticketPrice, setTicketPrice] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number | null>(null);
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState<string | null>(null);
  const [bannerDataUrl, setBannerDataUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  useEffect(() => {
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      if (e < s) setErrors("End time must be after start time.");
      else setErrors(null);
    } else setErrors(null);
  }, [start, end]);

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setBannerDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeBanner() {
    setBannerDataUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function toggleThemePopup() {
    setThemeOpen((v) => !v);
  }

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!title.trim()) {
      setErrors("Please add an event title.");
      return;
    }
    if (!start || !end) {
      setErrors("Please choose start and end date/time.");
      return;
    }
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
    };

    setShowPreview(true);

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "event-payload.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#523444] text-gray-100 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left column - banner + theme button */}
        <div className="col-span-1">
          <div className="relative w-full">
            {/* banner box */}
            <div className="h-64 w-full rounded-xl bg-gradient-to-br from-pink-400 via-red-500 to-yellow-400 shadow-lg overflow-hidden flex items-center justify-center">
              {bannerDataUrl ? (
                <img src={bannerDataUrl} alt="banner" className="object-cover h-full w-full" />
              ) : (
                <div className="text-gray-800 font-bold text-xl">Event Banner Preview</div>
              )}
            </div>

            {/* upload control - give it a high z so it stays above the theme popup */}
            <label
              className="absolute  right-3 mt-7  bg-white p-2 rounded-full shadow cursor-pointer z-50"
              title="Change banner"
            >
              <input ref={fileRef} type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#5d2a3a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5V8a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v8.5M8 12l2 2 4-4 4 4" />
              </svg>
            </label>

            {/* remove button — moved upward so it won't collide with theme popup */}
            {bannerDataUrl && (
              <button
                onClick={removeBanner}
                className="absolute left-3 mt-8 bg-white/90 px-3 py-1 rounded-md text-sm text-gray-800 z-50"
                title="Remove banner"
              >
                Remove
              </button>
            )}

            {/* theme small info card */}
            <div className="mt-25 p-3 rounded-lg bg-white/5 shadow-inner">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-300">Theme</div>
                  <div className="text-base font-semibold">{theme ?? "Minimal (none)"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setTheme(null)} className="px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 text-sm z-10">
                    Clear
                  </button>
                  <button onClick={toggleThemePopup} className="px-3 py-2 bg-white/10 rounded-md hover:bg-white/20 text-sm z-10">
                    Select Theme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - form */}
        <div className="col-span-1 md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h1 className="text-4xl font-bold text-white">Create Event</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300">Event Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-white/5 placeholder:text-gray-400" placeholder="My awesome event" />
              </div>

              <div>
                <label className="block text-sm text-gray-300">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-white/5 placeholder:text-gray-400" placeholder="Offline location or virtual link" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-300">Start</label>
                <input type="datetime-local" value={start ?? ""} onChange={(e) => setStart(e.target.value || null)} className="w-full mt-2 p-3 rounded-lg bg-white/5" />
              </div>

              <div>
                <label className="block text-sm text-gray-300">End</label>
                <input type="datetime-local" value={end ?? ""} onChange={(e) => setEnd(e.target.value || null)} className="w-full mt-2 p-3 rounded-lg bg-white/5" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full mt-2 p-3 rounded-lg bg-white/5 placeholder:text-gray-400" placeholder="Add event details" />
            </div>

            <div className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">Require Approval</div>
                  <div className="text-xs text-gray-400">If on, attendees need approval from host</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" checked={requireApproval} onChange={() => setRequireApproval((v) => !v)} />
                  <div className={`w-11 h-6 rounded-full transition-colors ${requireApproval ? "bg-indigo-500" : "bg-gray-500"}`}></div>
                  <span className="ml-3 text-sm">{requireApproval ? "On" : "Off"}</span>
                </label>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <div className="text-sm text-gray-300">Tickets</div>
                  <div className="flex gap-2 mt-2">
                    <button type="button" onClick={() => setTicketsFree(true)} className={`px-3 py-2 rounded-md ${ticketsFree ? "bg-indigo-600" : "bg-white/6"}`}>Free</button>
                    <button type="button" onClick={() => setTicketsFree(false)} className={`px-3 py-2 rounded-md ${!ticketsFree ? "bg-indigo-600" : "bg-white/6"}`}>Paid</button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-300">Ticket Price</label>
                  <input type="number" min={0} value={ticketPrice ?? ""} onChange={(e) => setTicketPrice(e.target.value ? Number(e.target.value) : null)} disabled={ticketsFree} className="w-full mt-2 p-3 rounded-lg bg-white/5" placeholder="0" />
                </div>

                <div>
                  <label className="text-sm text-gray-300">Capacity</label>
                  <input type="number" min={1} value={capacity ?? ""} onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : null)} className="w-full mt-2 p-3 rounded-lg bg-white/5" placeholder="Unlimited" />
                </div>
              </div>
            </div>

            {errors && <div className="text-red-300">{errors}</div>}

            <div className="flex items-center gap-4">
              <button type="submit" className="px-6 py-3 bg-white text-[#3b2330] rounded-lg font-semibold shadow">Create Event</button>
              <button type="button" onClick={() => { setTitle("My Demo Party"); setStart(new Date(Date.now() + 1000 * 60 * 60).toISOString().slice(0, 16)); setEnd(new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString().slice(0, 16)); setLocation("Virtual / Zoom link"); }} className="px-4 py-2 bg-white/6 rounded-lg">Autofill demo</button>
            </div>
          </form>
        </div>
      </div>

      {/* Theme selector popup - bottom right (lower z so banner controls remain on top) */}
      <div className="fixed right-6 bottom-6 z-40">
        <button onClick={toggleThemePopup} className="px-4 py-2 rounded-full bg-indigo-600 shadow-lg z-40">Themes</button>

        {themeOpen && (
          <div className="mt-3 w-96 h-64 bg-white/6 rounded-xl p-4 backdrop-blur shadow-2xl">
            <div className="text-gray-200 font-semibold mb-2">Choose a theme (placeholder)</div>
            <div className="border-2 border-dashed border-white/10 h-28 rounded-md flex items-center justify-center text-sm text-gray-400">No themes yet — drop your theme cards here or add from the admin panel.</div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-300">Selected: {theme ?? "None"}</div>
              <div className="flex gap-2">
                <button onClick={() => setTheme((t) => (t === "Minimal" ? null : "Minimal"))} className="px-3 py-1 rounded bg-white/6">Pick Minimal</button>
                <button onClick={() => setTheme("Confetti")} className="px-3 py-1 rounded bg-white/6">Pick Confetti</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-[90%] md:w-3/4 lg:w-1/2 bg-white/6 p-6 rounded-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-bold">Event Preview</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowPreview(false)} className="px-3 py-1 rounded bg-white/6">Close</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <div className="h-40 w-full rounded-lg overflow-hidden bg-gray-800">
                  {bannerDataUrl ? <img src={bannerDataUrl} className="h-full w-full object-cover" /> : <div className="p-4 text-gray-300">No banner</div>}
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="text-xl font-semibold">{title || "(no title)"}</div>
                <div className="text-sm text-gray-300 mt-2">{description || "(no description)"}</div>
                <div className="mt-4 text-sm text-gray-200">
                  <div>Start: {start ? new Date(start).toLocaleString() : "-"}</div>
                  <div>End: {end ? new Date(end).toLocaleString() : "-"}</div>
                  <div>Location: {location || "-"}</div>
                  <div>Theme: {theme || "None"}</div>
                  <div>Require Approval: {requireApproval ? "Yes" : "No"}</div>
                  <div>Tickets: {ticketsFree ? "Free" : `Paid — ${ticketPrice ?? 0}`}</div>
                  <div>Capacity: {capacity ?? "Unlimited"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
