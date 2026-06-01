"use client";
import { FileSearch, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/dashboard/FileUpload";
import AnalysisResult from "@/components/dashboard/AnalysisResult";
import { useState } from "react";

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

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisData | null>(null);

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Analysis failed. Please try again");
        return;
      }

      setResult(data.data);

      setTimeout(() => {
        document.getElementById("result")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error(error);
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
        <div className="bg-violet-50 p-2 rounded-lg">
          <FileSearch size={20} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analyze Resume</h1>
          <p className="text-gray-500 text-sm">
            Get AI-powered ATS score and improvement suggestions
          </p>
        </div>
      </div>

      {/* Upload Form */}
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
              (optional but recommended)
            </span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here for a more accurate analysis..."
            rows={5}
            maxLength={5000}
            className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-gray-700 placeholder:text-gray-400"
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
            onClick={handleAnalyze}
            disabled={loading || !file}
            className="bg-violet-600 hover:bg-violet-700 text-white flex-1 gap-2"
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
            <Button variant="outline" onClick={handleReset}>
              Analyze Another
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
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
