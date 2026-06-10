"use client";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { LayoutDashboard, Loader2 } from "lucide-react";

const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="Kira" width={28} height={28} />
          <span className="text-xl font-bold bg-linear-to-r from-sky-blue-600 to-sky-blue-500 bg-clip-text text-transparent">
            Kira
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#testimonials"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Testimonials
          </a>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            // Loading state
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-gray-400" />
            </div>
          ) : isLoggedIn ? (
            // ✅ Already logged in — show Go to Dashboard
            <div className="flex items-center gap-3">
              <span className="hidden md:block text-sm text-gray-500">
                Welcome, {session?.user?.name?.split(" ")[0]}!
              </span>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-white bg-linear-to-r from-sky-blue-600 to-sky-blue-500 hover:from-sky-blue-700 hover:to-sky-blue-600 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-blue-500/25"
              >
                <LayoutDashboard size={16} />
                Go to Dashboard
              </Link>
            </div>
          ) : (
            // ❌ Not logged in — show Login + Get Started
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-white bg-linear-to-r from-sky-blue-600 to-sky-blue-500 hover:from-sky-blue-700 hover:to-sky-blue-600 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-sky-blue-500/25"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
