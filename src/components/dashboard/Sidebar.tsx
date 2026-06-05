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
} from "lucide-react";
import { signOut } from "next-auth/react";

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

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r flex flex-col h-full shrink-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-sky-blue-600">Kira</h1>
        <p className="text-xs text-gray-400 mt-0.5">AI Resume Analyzer</p>
      </div>

      {/* User Info */}
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
            // Fallback avatar if no image
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

      {/* Navigation */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
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

      {/* Logout */}
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
