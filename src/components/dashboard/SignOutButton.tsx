"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 shrink-0"
    >
      <LogOut size={16} />
      Sign Out
    </Button>
  );
}
