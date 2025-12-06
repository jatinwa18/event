// src/layouts/AppLayout.tsx

import { Outlet, Link } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-700 flex flex-col">
      
      {/* Simple Navbar */}
      <header className="bg-gray-800 shadow-sm py-4 px-6 flex justify-between">
        <Link to="/" className="text-xl text-white font-semibold">
          EventApp
        </Link>

        <nav className="flex gap-4">
          <Link to="/discover" className="text-white">
            Discover
          </Link>
          <Link to="/create-event" className="text-white">
            Create Event
          </Link>
        </nav>
      </header>

      {/* Page content */}
      <main className="flex-1 ">
        <Outlet />
      </main>

    </div>
  );
};

export default AppLayout;
