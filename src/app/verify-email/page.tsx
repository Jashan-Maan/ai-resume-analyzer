"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Verify email form component
function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // State for OTP digits
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  // Loading flag for verification request
  const [loading, setLoading] = useState(false);
  // Error message for UI feedback
  const [error, setError] = useState("");
  // Flag indicating resend request in progress
  const [resending, setResending] = useState(false);
  // Refs for each OTP input element
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Resend verification code to the user's email
  const handleResend = async () => {
    setResendLoading(true);
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setResendMessage(data.message);
      toast.success(data.message);
    } catch {
      toast.error("Failed to resend. Please try again.");
      setResendMessage("Failed to resend. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  // Auto focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Handle OTP input
  // Update OTP digit at a specific index
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // only numbers

    const newCode = [...code];
    newCode[index] = value.slice(-1); // only last digit
    setCode(newCode);

    // Auto advance to next input
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  // Handle backspace navigation between inputs
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  // Support pasting the full OTP code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newCode = [...code];
    pasted.split("").forEach((digit, i) => {
      if (i < 6) newCode[i] = digit;
    });
    setCode(newCode);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Submit the OTP to the backend for verification
  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        toast.error(data.message);
        return;
      }

      // Success → go to login
      router.push("/login?verified=true");
      toast.success("Email verified successfully");
    } catch {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render the verification UI
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md text-center">
      {/* Icon */}
      <div className="text-5xl mb-4">📧</div>

      <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
      <p className="text-gray-500 text-sm mb-1">We sent a 6-digit code to</p>
      <p className="text-sky-blue-600 font-medium text-sm mb-6">{email}</p>

      {/* OTP input fields */}
      <div className="flex gap-3 justify-center mb-6">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-sky-blue-500 transition"
          />
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Verify button */}
      <Button
        onClick={handleVerify}
        disabled={loading || code.join("").length !== 6}
        className="w-full bg-sky-blue-600 hover:bg-sky-blue-700 text-white mb-4"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin mr-2" />
            Verifying...
          </>
        ) : (
          "Verify Email"
        )}
      </Button>

      <p className="text-xs text-gray-400">Code expires in 10 minutes</p>
      {/* Resend verification code section */}
      <div className="mt-4">
        <p className="text-xs text-gray-400 mb-2">Didn't receive the code?</p>
        <button
          onClick={handleResend}
          disabled={resendLoading}
          className="text-sky-blue-600 text-xs hover:underline disabled:opacity-50 flex items-center gap-1 mx-auto"
        >
          {resendLoading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Sending...
            </>
          ) : (
            "Resend verification code"
          )}
        </button>
        {resendMessage && (
          <p className="text-xs text-green-600 mt-2">{resendMessage}</p>
        )}
      </div>
    </div>
  );
}

// 2. Wrap the form in a Suspense boundary in the main Page component
// Main page component with Suspense wrapper
export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense
        fallback={
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-sky-blue-600 mb-4" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
