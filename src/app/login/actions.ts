// Enable server-side rendering for authentication actions
"use server";

// Import signIn helper from auth utilities
import { signIn } from "@/auth";

// Sign in using Google OAuth provider
export async function signInWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

// Sign in using GitHub OAuth provider
export async function signInWithGithub() {
  await signIn("github", { redirectTo: "/dashboard" });
}
