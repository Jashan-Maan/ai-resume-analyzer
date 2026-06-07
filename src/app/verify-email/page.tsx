"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Handle OTP input
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
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // Handle paste
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

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
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
        return;
      }

      // Success → go to login
      router.push("/login?verified=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border w-full max-w-md text-center">
        {/* Icon */}
        <div className="text-5xl mb-4">📧</div>

        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Check your email
        </h1>
        <p className="text-gray-500 text-sm mb-1">We sent a 6-digit code to</p>
        <p className="text-sky-blue-600 font-medium text-sm mb-6">{email}</p>

        {/* OTP Input */}
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
      </div>
    </div>
  );
}
