"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileSearch,
  Briefcase,
  BarChart2,
  User,
  LogOut,
  MessageSquare,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

/**
 * List of navigation links to display in the sidebar.
 * Each link has a href destination, a display label, and a Lucide icon component.
 */
const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analyze", label: "Analyze Resume", icon: FileSearch },
  {
    href: "/dashboard/interview",
    label: "Mock Interview",
    icon: MessageSquare,
  },
  { href: "/dashboard/jobs", label: "Job Applications", icon: Briefcase },
  { href: "/dashboard/analyses", label: "My Analyses", icon: BarChart2 },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

/**
 * Props expected by the Sidebar component.
 */
interface SidebarProps {
  /** The currently authenticated user's session data */
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  /** Optional callback to close the sidebar (used on mobile devices) */
  onClose?: () => void;
}

/**
 * Sidebar component that provides navigation, user profile information, and sign-out functionality.
 */
const Sidebar = ({ user, onClose }: SidebarProps) => {
  // Hook to get the active route path to highlight the corresponding navigation item
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full shrink-0">
      {/* Logo and Application Branding Header */}
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-sky-blue-600">Kira</h1>
          <p className="text-xs text-gray-400 mt-0.5">AI Resume Analyzer</p>
        </div>
        {/* Mobile close button: visible only on small screens when onClose is provided */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Info Section: Displays user avatar/initials, name, and email */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          {user.image ? (
            <Image
              src={user.image}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full ring-2 ring-sky-blue-100"
            />
          ) : (
            // Fallback avatar displaying user's first initial if no image is present
            <div className="w-10 h-10 rounded-full bg-sky-blue-100 flex items-center justify-center">
              <span className="text-sky-blue-600 font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="overflow-hidden">
            <p className="font-medium text-sm text-gray-800 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links List */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          // Check if current route matches this link's destination
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                ${
                  isActive
                    ? "bg-sky-blue-50 text-sky-blue-600 font-medium border border-sky-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-sky-blue-600" : "text-gray-400"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action Area at the bottom of the sidebar */}
      <div className="p-3 border-t">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all w-full"
        >
          <LogOut size={18} className="text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

