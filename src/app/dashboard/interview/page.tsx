"use client";
import { useState } from "react";
import { MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/dashboard/FileUpload";
import InterviewResult from "@/components/dashboard/InterviewResult";
import { toast } from "sonner";

interface InterviewData {
  technical: {
    question: string;
    difficulty: "easy" | "medium" | "hard";
    topic: string;
  }[];
  behavioral: {
    question: string;
    tip: string;
  }[];
  projectBased: {
    question: string;
    project: string;
  }[];
}

export default function InterviewPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<InterviewData | null>(null);

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please upload your resume first");
      setError("Please upload your resume first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const loadingToast = toast.loading("Generating interview questions...");

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/interview", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (res.status === 429) {
        setError(data.message);
        toast.error(data.message);
        return;
      }

      if (res.status === 503 || res.status === 500) {
        setError("AI is currently busy. Please try again later.");
        toast.error("AI is currently busy. Please try again later.");
        return;
      }

      if (!data.success) {
        setError(
          data.message || "Failed to generate questions. Please try again.",
        );
        toast.error(data.message || "Failed to generate questions");
        return;
      }

      setResult(data.data);
      toast.success("Interview questions generated!");

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription("");
    setResult(null);
    setError("");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-sky-blue-50 p-2 rounded-lg">
          <MessageSquare size={20} className="text-sky-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mock Interview</h1>
          <p className="text-gray-500 text-sm">
            AI-generated interview questions based on your resume
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border p-6 space-y-5">
        {/* File Upload */}
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

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
            <span className="text-gray-400 font-normal ml-1">
              (highly recommended for targeted questions)
            </span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to get role-specific interview questions..."
            rows={5}
            maxLength={5000}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 resize-none text-gray-700 placeholder:text-gray-400"
          />
          <p className="text-xs text-gray-400 mt-1 text-right">
            {jobDescription.length}/5000
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleGenerate}
            disabled={loading || !file}
            className="bg-sky-blue-600 hover:bg-sky-blue-700 text-white flex-1 gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating questions... (may take 15-20 seconds)
              </>
            ) : (
              <> Generate Interview Questions</>
            )}
          </Button>

          {result && (
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw size={15} />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Tips */}
      {!result && (
        <div className="bg-white rounded-xl border p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            💡 How to use Mock Interview
          </h3>
          <div className="space-y-2">
            {[
              "Upload your resume PDF and paste the job description",
              "LLM model analyzes both to generate relevant questions",
              "You get 5 technical, 3 behavioral, and 3 project-based questions",
              "Expand each question to see tips on how to answer",
              "Practice answering out loud before your real interview",
            ].map((tip, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-sm text-gray-500"
              >
                <span className="text-sky-blue-500 font-bold shrink-0">
                  {i + 1}.
                </span>
                {tip}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div id="results">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Interview Questions
            </h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {result.technical.length +
                result.behavioral.length +
                result.projectBased.length}{" "}
              questions total
            </span>
          </div>
          <InterviewResult data={result} />
        </div>
      )}
    </div>
  );
}
