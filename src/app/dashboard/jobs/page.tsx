// src/app/dashboard/jobs/page.tsx
"use client";
import { useState, useEffect } from "react";
import JobTable from "@/components/dashboard/JobTable";
import AddJobModal from "@/components/dashboard/AddJobModal";
import { Briefcase } from "lucide-react";

interface Job {
  _id: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  appliedDate: string;
  note?: string;
}

type FilterStatus = "all" | "applied" | "interview" | "offer" | "rejected";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success) setJobs(data.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAdded = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((job) => job._id !== id));
  };

  const handleStatusChange = (id: string, status: string) => {
    setJobs(
      jobs.map((job) =>
        job._id === id ? { ...job, status: status as Job["status"] } : job,
      ),
    );
  };

  // ✅ handles full edit including status
  const handleEdit = (id: string, data: Partial<Job>) => {
    setJobs(jobs.map((job) => (job._id === id ? { ...job, ...data } : job)));
  };

  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Applied", value: "applied" },
    { label: "Interview", value: "interview" },
    { label: "Offer", value: "offer" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-50 p-2 rounded-lg">
            <Briefcase size={20} className="text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Job Applications
            </h1>
            <p className="text-gray-500 text-sm">
              {jobs.length} total application{jobs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <AddJobModal onJobAdded={handleJobAdded} />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map((tab) => {
          const count =
            tab.value === "all"
              ? jobs.length
              : jobs.filter((j) => j.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition
                ${
                  filter === tab.value
                    ? "bg-violet-600 text-white"
                    : "bg-white border text-gray-600 hover:border-violet-300"
                }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs ${
                  filter === tab.value ? "text-violet-200" : "text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-400 text-sm">Loading jobs...</p>
        </div>
      ) : (
        <JobTable
          jobs={filteredJobs}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
