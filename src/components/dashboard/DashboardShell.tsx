"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

/**
 * Properties expected by the DashboardShell component.
 */
interface DashboardShellProps {
  /** The authenticated user info (name, email, avatar image). */
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  /** Main page content to render inside the dashboard view. */
  children: React.ReactNode;
}

/**
 * DashboardShell provides the primary page layout for the application dashboard.
 * It encapsulates a responsive sidebar navigation panel and a scrollable main content frame,
 * handling the toggle state for mobile viewports.
 */
export default function DashboardShell({ user, children }: DashboardShellProps) {
  // State tracking the open/closed status of the navigation sidebar on mobile devices
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-sky-50">
      {/* Backdrop overlay visible only on mobile screens when the sidebar is toggled open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar container - slide-in drawer on mobile, static sidebar on medium screens and up */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-0 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar user={user} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content area containing header and page content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header: Visible only on small viewports to offer menu access and application branding */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-white border-b shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1 -ml-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-blue-500 rounded"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-sky-blue-600 leading-none">Kira</h1>
              <p className="text-[10px] text-gray-400 mt-0.5">AI Resume Analyzer</p>
            </div>
          </div>
        </header>

        {/* Scrollable container for the main view content */}
        <div className="flex-1 overflow-auto">
          <main className="max-w-7xl mx-auto w-full p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
