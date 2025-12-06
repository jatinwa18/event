import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.tsx";

// ---- Pages ----
import DiscoverEvents from "./components/discover/DiscoverEvents.tsx"; 
import CreateEvent from "./components/create-event/CreateEvent.tsx"; 

export default function App() {
  return (
    <Routes>
      {/* All routes wrapped inside your main layout */}
      <Route element={<AppLayout />}>
        
        {/* Discover Events Page */}
        <Route path="/" element={<DiscoverEvents />} />

        {/* Create Event Page (currently empty) */}
        <Route path="/create" element={<CreateEvent />} />

      </Route>
    </Routes>
  );
}


