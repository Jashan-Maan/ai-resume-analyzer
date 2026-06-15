"use client";
import { FileSearch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/dashboard/FileUpload";
import AnalysisResult from "@/components/dashboard/AnalysisResult";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Interface detailing the parsed JSON response structure returned
 * by the resume analyzer's backend AI endpoint.
 */
interface AnalysisData {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  suggestions: { priority: "high" | "medium" | "low"; suggestion: string }[];
  sectionsFound: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    summary: boolean;
  };
}

/**
 * Client-side Component that handles selecting a PDF resume,
 * entering an optional job description, and calling the AI analysis API.
 */
export default function AnalyzePage() {
  // State variables for tracking files, job description, loading state, error messages, and API output.
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisData | null>(null);

  /**
   * Submits the resume file and job description to the POST /api/analyze endpoint.
   * Handles API rate limits (429), server downtime (503/500), and updates status indicators.
   */
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first");
      toast.error("Please upload your resume first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const loadingToast = toast.loading("Analyzing your resume...");

    try {
      // Prepare multipart/form-data payload containing the resume file and JD
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      // Handle Rate Limiting
      if (res.status === 429) {
        setError(data.message); // shows "Try again in X time later"
        toast.error(data.message);
        return;
      }

      // Handle server and AI model provider failures
      if (res.status === 503 || res.status === 500) {
        setError("AI is currently busy. Please try again later.");
        toast.error("AI is currently busy. Please try again later.");
        return;
      }

      // Handle custom failure responses
      if (!data.success) {
        setError(data.message || "Analysis failed. Please try again");
        toast.error(data.message || "Analysis failed");
        return;
      }

      // Set successful analysis results
      setResult(data.data);
      toast.success("Resume analyzed successfully!");

      // Smooth scroll to the results section after rendering
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets all states to allow analyzing a new resume.
   */
  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header section with page title */}
      <div className="flex items-center gap-3">
        <div className="bg-sky-blue-50 p-2 rounded-lg">
          <FileSearch size={20} className="text-sky-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analyze Resume</h1>
          <p className="text-gray-500 text-sm">
            Get AI-powered ATS score and improvement suggestions
          </p>
        </div>
      </div>

      {/* Upload Form and Input Controls */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        {/* File Upload zone component */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume (PDF) *
          </label>
          <FileUpload
            onFileSelect={setFile}
            selectedFile={file}
            onClear={() => setFile(null)}
          />
        </div>

        {/* Text area for optional Job Description context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
            <span className="text-gray-400 font-normal ml-1">
              (optional but recommended)
            </span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for a more accurate analysis..."
            rows={5}
            maxLength={5000}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 resize-none text-gray-700 placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {jobDescription.length}/5000
          </p>
        </div>

        {/* Error message card */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Action Triggers (Analyze / Reset buttons) */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="bg-sky-blue-600 hover:bg-sky-blue-700 text-white flex-1 gap-2 w-full justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing... (this may take 10-15 seconds)
              </>
            ) : (
              <>✦ Analyze Resume</>
            )}
          </Button>

          {result && (
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto justify-center">
              Analyze Another
            </Button>
          )}
        </div>
      </div>

      {/* Render the resulting analysis once API data is ready */}
      {result && (
        <div id="results">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Analysis Results
          </h2>
          <AnalysisResult data={result} />
        </div>
      )}
    </div>
  );
}
