"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SignOutButton component.
 * Renders an outline styled button that signs the user out of their session using next-auth 
 * and redirects them back to the login page.
 */
export default function SignOutButton() {
  return (
    <Button
      variant="outline"
      // Triggers sign-out flow and redirects the user to '/login' after successful completion
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 shrink-0"
    >
      <LogOut size={16} />
      Sign Out
    </Button>
  );
}
