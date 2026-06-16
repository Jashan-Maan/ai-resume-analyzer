"use client";
import { useState, useEffect } from "react";
import JobTable from "@/components/dashboard/JobTable";
import AddJobModal from "@/components/dashboard/AddJobModal";
import { Briefcase } from "lucide-react";
import { toast } from "sonner";

// Type definition for a single Job Application record
interface Job {
  _id: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  appliedDate: string;
  note?: string;
}

// Allowed values for filtering the job list
type FilterStatus = "all" | "applied" | "interview" | "offer" | "rejected";

/**
 * JobsPage Component
 * Renders the dashboard view for tracking and managing job applications.
 * Allows filtering applications by status, adding new jobs, editing, and deleting.
 */
export default function JobsPage() {
  // State for storing the list of job applications
  const [jobs, setJobs] = useState<Job[]>([]);
  // Loading state during initial data fetch
  const [loading, setLoading] = useState(true);
  // Current active filter selection
  const [filter, setFilter] = useState<FilterStatus>("all");

  // Fetch job applications on initial component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  /**
   * Fetches all job applications from the database API
   */
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

  /**
   * Callback executed when a new job application is successfully created
   * Prepends the new job to the top of the jobs list.
   */
  const handleJobAdded = (newJob: Job) => {
    setJobs([newJob, ...jobs]);
    toast.success("Job application added!");
  };

  /**
   * Callback executed when a job application is deleted
   * Removes the job with the specified ID from the list.
   */
  const handleDelete = (id: string) => {
    setJobs(jobs.filter((job) => job._id !== id));
    toast.success("Job application deleted");
  };

  /**
   * Callback executed when the status of a job is updated directly
   * Locates the job and updates its status field.
   */
  const handleStatusChange = (id: string, status: string) => {
    setJobs(
      jobs.map((job) =>
        job._id === id ? { ...job, status: status as Job["status"] } : job,
      ),
    );
    toast.success(`Status updated to ${status}`);
  };

  /**
   * Callback executed when an existing job application is edited/updated
   * Merges new data fields into the matched job object.
   */
  const handleEdit = (id: string, data: Partial<Job>) => {
    setJobs(jobs.map((job) => (job._id === id ? { ...job, ...data } : job)));
    toast.success("Job application updated!");
  };

  // Derive the list of jobs to display based on the selected filter
  const filteredJobs =
    filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

  // Configuration for filter tabs rendering
  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Applied", value: "applied" },
    { label: "Interview", value: "interview" },
    { label: "Offer", value: "offer" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Header section with page title, total counts, and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-sky-blue-50 p-2 rounded-lg">
            <Briefcase size={20} className="text-sky-blue-600" />
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
        <div className="w-full sm:w-auto">
          <AddJobModal onJobAdded={handleJobAdded} />
        </div>
      </div>

      {/* Filter Tabs for quick views */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map((tab) => {
          // Calculate the count of applications within this specific tab filter
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
                    ? "bg-sky-blue-600 text-white"
                    : "bg-white border text-gray-600 hover:border-sky-blue-300"
                }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs ${
                  filter === tab.value ? "text-sky-blue-200" : "text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content table or loading state */}
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
