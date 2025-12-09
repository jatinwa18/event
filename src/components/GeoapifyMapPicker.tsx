// src/components/GeoapifyMapPicker.tsx
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

type Props = {
  apiKey: string;
  address: string;
  onAddressChange: (v: string) => void;
  onSelectLocation: (lat: number, lng: number, formatted: string) => void;
  mapHeight?: string;
  country?: string; // optional country code to restrict results (e.g. "in")
};

export default function GeoapifyMapPicker({
  apiKey,
  address,
  onAddressChange,
  onSelectLocation,
  mapHeight = "250px",
  country,
}: Props) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Leaflet default icon fix for many bundlers
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  // avoid overriding multiple times
  // @ts-ignore
  if (!L.Marker.prototype.options.icon) L.Marker.prototype.options.icon = DefaultIcon;

  // debounce helper
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    setErr(null);
    setSuggestions([]);

    // don't query if short input
    const minLength = 2;
    if (!address || address.length < minLength) {
      setLoading(false);
      return;
    }

    // debounce
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(address);
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]); // run when address changes

  async function fetchSuggestions(q: string) {
    if (!apiKey) {
      setErr("No Geoapify API key provided.");
      console.error("[GeoapifyMapPicker] Missing API key (apiKey prop is empty).");
      return;
    }

    setLoading(true);
    setErr(null);

    // build URL
    const params = new URLSearchParams({
      text: q,
      limit: "6",
      apiKey,
    });
    // optional country restriction
    if (country) params.set("filter", `countrycode:${country}`);

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Geoapify error ${res.status}: ${txt}`);
      }
      const data = await res.json();

      // Geoapify returns features array
      const features = data.features || [];
      setSuggestions(features);
      // debug
      console.log("[GeoapifyMapPicker] suggestions", features);
    } catch (e: any) {
      console.error("[GeoapifyMapPicker] fetch error:", e);
      setErr(e.message || "Failed to fetch suggestions");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="relative">
        <input
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="Search address..."
          className="w-full p-3 rounded border bg-white/90"
          aria-label="Search address"
        />

        {/* dropdown */}
        {loading && (
          <div className="absolute right-3 top-3 text-sm text-gray-600">Loading…</div>
        )}
        {err && <div className="text-red-600 mt-2 text-sm">{err}</div>}

        {suggestions.length > 0 && (
          <div
            className="absolute left-0 right-0 mt-1 bg-white rounded shadow z-10000 overflow-hidden"
            style={{ maxHeight: 260, overflowY: "auto" }}
          >
            {suggestions.map((s: any) => {
              const props = s.properties || {};
              const id = props.place_id ?? props.osm_id ?? Math.random();
              const formatted = props.formatted ?? props.label ?? s.text ?? "";
              const lat = props.lat ?? s.geometry?.coordinates?.[1];
              const lon = props.lon ?? s.geometry?.coordinates?.[0];

              return (
                <div
                  key={id}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    if (lat && lon) {
                      setMarkerPos([Number(lat), Number(lon)]);
                      onSelectLocation(Number(lat), Number(lon), formatted);
                    } else {
                      // fallback: just forward formatted address
                      onAddressChange(formatted);
                      onSelectLocation(null as any, null as any, formatted);
                    }
                    setSuggestions([]);
                  }}
                >
                  <div className="text-sm">{formatted}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {props.state || props.city || props.country || ""}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3">
        <MapContainer
          center={markerPos ?? [20.5937, 78.9629]}
          zoom={markerPos ? 15 : 5}
          style={{ height: mapHeight, width: "100%", borderRadius: 8 }}
        >
          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}`}
          />
          {markerPos && <Marker position={markerPos} />}
        </MapContainer>
      </div>
    </div>
  );
}
