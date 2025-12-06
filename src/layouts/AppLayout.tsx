// src/layouts/AppLayout.tsx

import { Outlet, Link } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Simple Navbar */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between">
        <Link to="/" className="text-xl font-semibold">
          EventApp
        </Link>

        <nav className="flex gap-4">
          <Link to="/discover" className="hover:underline">
            Discover
          </Link>
          <Link to="/create-event" className="hover:underline">
            Create Event
          </Link>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>

    </div>
  );
};

export default AppLayout;
