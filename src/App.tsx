import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout.tsx";

// ---- Pages (route entry points) ----
import DiscoverEvents from "./pages/DiscoverEvents";
import CreateEvent from "./pages/CreateEvent";

export default function App() {
  return (
    <Routes>

      <Route element={<AppLayout />}>

        <Route path="/" element={<DiscoverEvents />} />
        <Route path="/discover" element={<DiscoverEvents />} />

        <Route path="/create-event" element={<CreateEvent />} />

      </Route>
    </Routes>
  );
}


