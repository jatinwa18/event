// src/components/ThemeSelector.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme, clearTheme } from "../store/themeSlice";
import type { RootState } from "../store/store";

export default function ThemeSelector({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dispatch = useDispatch();
  const theme = useSelector((s: RootState) => s.theme.selectedTheme);

  if (!open) return null;

  const THEME_OPTIONS = [
    {
      name: "Minimal",
      preview: "bg-gray-200",
    },
    {
      name: "Confetti",
      preview: "bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-300",
    },

    {
      name: "Ocean",
      preview: "bg-gradient-to-br from-blue-600 via-cyan-400 to-blue-300",
    },
    {
      name: "Sunset",
      preview: "bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300",
    },
    {
      name: "Galaxy",
      preview: "bg-gradient-to-br from-purple-800 via-blue-700 to-black",
    },
  ];

  return (
    <div className="fixed right-6 bottom-6 z-40 bg-white/10 backdrop-blur-lg p-5 w-96 rounded-xl shadow-xl border border-white/20">

      <div className="text-xl font-bold text-white mb-4">Choose Theme</div>

      <div className="grid grid-cols-2 gap-4">
        {THEME_OPTIONS.map((t) => (
          <button
            key={t.name}
            onClick={() => dispatch(setTheme(t.name))}
            className={`p-3 rounded-lg bg-white/10 hover:bg-white/20 border ${
              theme === t.name ? "border-yellow-300" : "border-transparent"
            }`}
          >
            <div className="font-semibold">{t.name}</div>
            <div className={`mt-2 h-16 rounded-md ${t.preview}`}></div>
          </button>
        ))}
      </div>

      <button
        onClick={() => dispatch(clearTheme())}
        className="mt-4 w-full p-2 rounded-md bg-white/20 hover:bg-white/30"
      >
        Clear Theme
      </button>

      <button
        onClick={onClose}
        className="mt-2 w-full p-2 rounded-md bg-white/20 hover:bg-white/30"
      >
        Close
      </button>
    </div>
  );
}


