"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { format } from "date-fns";
import { toast } from "sonner";

/**
 * Representation of a tracked job application.
 */
interface Job {
  _id: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  appliedDate: string;
  note?: string;
}

/**
 * Properties expected by the JobTable component.
 */
interface JobTableProps {
  /** Array of job applications to display in the table. */
  jobs: Job[];
  /** Parent callback triggered after a job is successfully deleted from the database. */
  onDelete: (id: string) => void;
  /** Parent callback triggered when a job's application status is changed. */
  onStatusChange: (id: string, status: string) => void;
  /** Parent callback triggered when a job's details are edited and saved. */
  onEdit: (id: string, data: Partial<Job>) => void;
}

/**
 * JobTable renders a list of tracked job applications in a tabular format.
 * It provides interactive controls to update the status, edit details via a modal form,
 * or delete an application, syncing changes with the API.
 */
export default function JobTable({
  jobs,
  onDelete,
  onStatusChange,
  onEdit,
}: JobTableProps) {
  // Tracks the ID of the job currently being deleted to show a loading/disabled state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Tracks the job object that is currently being edited in the modal
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Local form state for editing job fields
  const [editForm, setEditForm] = useState({
    company: "",
    role: "",
    status: "",
    note: "",
  });
  
  // Tracks the loading state during the API request for saving edits
  const [editLoading, setEditLoading] = useState(false);

  /**
   * Triggers a DELETE request to remove the specified job application.
   */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this job application?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        onDelete(id);
      } else {
        toast.error("Failed to delete. Please try again.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  /**
   * Triggers a PUT request to update the application status of a job.
   */
  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) onStatusChange(id, status);
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  /**
   * Populates the local form state and opens the Edit Modal for a given job.
   */
  const handleEditOpen = (job: Job) => {
    setEditingJob(job);
    setEditForm({
      company: job.company,
      role: job.role,
      status: job.status,
      note: job.note || "",
    });
  };

  /**
   * Handles submission of the edit form, making a PUT request and updating parent state on success.
   */
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setEditLoading(true);

    try {
      const res = await fetch(`/api/jobs/${editingJob._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        onEdit(editingJob._id, {
          ...editForm,
          status: editForm.status as Job["status"],
        });
        setEditingJob(null);
      } else {
        toast.success("Failed to update. Please try again.");
      }
    } catch (err) {
      console.error("Edit failed:", err);
      toast.error("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  // Render fallback empty state if no jobs have been added yet
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border">
        <p className="text-4xl mb-3">📋</p>
        <h3 className="font-semibold text-gray-800 mb-1">
          No jobs tracked yet
        </h3>
        <p className="text-gray-500 text-sm">
          Click "Add Job" to start tracking your applications
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Scrollable table container */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">
                  Company
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Role
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Applied Date
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Notes
                </TableHead>
                <TableHead className="font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id} className="hover:bg-gray-50 transition">
                  <TableCell className="font-medium">{job.company}</TableCell>
                  <TableCell className="text-gray-600">{job.role}</TableCell>

                  {/* Status Badge component displays colored badge matching application state */}
                  <TableCell>
                    <StatusBadge status={job.status} />
                  </TableCell>

                  <TableCell className="text-gray-500 text-sm">
                    {format(new Date(job.appliedDate), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm max-w-32 truncate">
                    {job.note || "—"}
                  </TableCell>

                  {/* Action buttons (Edit & Delete) */}
                  <TableCell className="flex gap-1">
                    {/* Edit button triggers the edit dialog pop-up */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditOpen(job)}
                      className="text-blue-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil size={15} />
                    </Button>

                    {/* Delete button triggers confirmation and handleDelete API callback */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(job._id)}
                      disabled={deletingId === job._id}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Job Modal Dialog overlay */}
      <Dialog open={!!editingJob} onOpenChange={() => setEditingJob(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Job Application</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Company</Label>
              <Input
                value={editForm.company}
                onChange={(e) =>
                  setEditForm({ ...editForm, company: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, status: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input
                value={editForm.note}
                onChange={(e) =>
                  setEditForm({ ...editForm, note: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setEditingJob(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editLoading}
                className="flex-1 bg-sky-blue-600 hover:bg-sky-blue-700 text-white"
              >
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
