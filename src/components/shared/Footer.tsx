"use client";
import Image from "next/image";
import { Lock, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Kira" width={24} height={24} />
            <span className="text-lg font-bold bg-linear-to-r from-sky-blue-600 to-sky-blue-500 bg-clip-text text-transparent">
              Kira
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Available Worldwide</span>
            </div>
          </div>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Kira. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
