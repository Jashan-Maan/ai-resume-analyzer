// Login page component imports
import { signInWithGoogle, signInWithGithub } from "./actions";
import CredentialsForm from "@/components/auth/CredentialsForm";
import Image from "next/image";
import Link from "next/link";

// Props definition for LoginPage
interface LoginPageProps {
  searchParams: Promise<{ verified?: string; error?: string }>;
}

// LoginPage component definition
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  // Render the login page UI
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md">
        // Logo header
{/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-sky-blue-600">Kira</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your account</p>
        </div>

        {/* Verified success */}
        // Verification success message
{params.verified && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-green-700 text-sm text-center">
              ✅ Email verified! You can now sign in.
            </p>
          </div>
        )}

        {/* Error messages */}
        // Error message handling
{params.error === "invalid-or-expired-token" && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
            <p className="text-red-600 text-sm text-center">
              Verification link expired. Please sign up again.
            </p>
          </div>
        )}

        {/* Email/Password form */}
        // Email/password credentials form
<CredentialsForm />

        {/* Divider */}
        // Divider between OAuth options
<div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google */}
        // Google sign-in button
<form action={signInWithGoogle}>
          <button className="w-full flex items-center justify-center gap-3 border rounded-lg p-3 hover:bg-gray-50 transition mb-3 text-gray-700 text-sm">
            <Image src="/google.svg" alt="Google" width={18} height={18} />
            Continue with Google
          </button>
        </form>

        {/* GitHub */}
        // GitHub sign-in button
<form action={signInWithGithub}>
          <button className="w-full flex items-center justify-center gap-3 border rounded-lg p-3 hover:bg-gray-50 transition mb-3 text-gray-700 text-sm">
            <Image src="/github.svg" alt="GitHub" width={18} height={18} />
            Continue with GitHub
          </button>
        </form>

        // Sign up link
{/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-sky-blue-600 hover:underline font-medium"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
