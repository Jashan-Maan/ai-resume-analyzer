// Mark this component as a Client Component so it can use hooks and handle events
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

/**
 * Props for AddJobModal.
 *
 * @prop onJobAdded - Callback invoked with the newly created job object after a
 *                    successful API response. Allows the parent component to
 *                    optimistically update its job list without a full page reload.
 */
interface AddJobModalProps {
  onJobAdded: (job: any) => void;
}

/**
 * AddJobModal — Modal dialog for adding a new job application.
 *
 * Renders a trigger button that opens a Dialog containing a form with fields
 * for company, role, application status, date, job description, and notes.
 * On submission the form data is POSTed to `/api/jobs`, and on success the
 * parent is notified via `onJobAdded` and the form is reset to its defaults.
 */
export default function AddJobModal({ onJobAdded }: AddJobModalProps) {
  // Controls the open/closed state of the dialog
  const [open, setOpen] = useState(false);

  // Tracks whether a submission request is in progress (disables the submit button)
  const [loading, setLoading] = useState(false);

  // Holds any error message to display inside the form after a failed submission
  const [error, setError] = useState("");

  // Controlled form state — `status` defaults to "applied" and `appliedDate`
  // defaults to today's date in YYYY-MM-DD format (compatible with <input type="date">)
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    jobDescription: "",
    note: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });

  /**
   * Generic change handler for all form inputs, selects, and textareas.
   * Uses the element's `name` attribute to update the correct field in state,
   * and clears any existing error message on every keystroke.
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error as user starts correcting input
  };

  /**
   * Handles form submission.
   * POSTs the form data to `/api/jobs`. On success, notifies the parent,
   * closes the dialog, and resets the form. On failure, surfaces an error
   * message both inline and via a toast notification.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors before a new attempt

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      // If the API signals failure, show the error and bail out
      if (!data.success) {
        setError(data.message || "Something went wrong");
        toast.error(data.message || "Failed to add job");
        return;
      }

      // Notify the parent component so it can prepend the new job to its list
      onJobAdded(data.data);

      // Close the dialog on success
      setOpen(false);

      // Reset the form back to its default values so it's clean for the next entry
      setForm({
        company: "",
        role: "",
        status: "applied",
        jobDescription: "",
        note: "",
        appliedDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      // Catch unexpected network / runtime errors
      setError("Failed to add job. Try again.");
      toast.error("Failed to add job. Try again.");
    } finally {
      // Always re-enable the submit button regardless of outcome
      setLoading(false);
    }
  };

  return (
    // Controlled Dialog — open state is managed externally so we can reset the
    // form when the modal is closed via the overlay or the Cancel button
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger button — opens the modal dialog */}
      <DialogTrigger asChild>
        <Button className="bg-sky-blue-600 hover:bg-sky-blue-700 text-white gap-2 w-full sm:w-auto justify-center">
          <Plus size={16} />
          Add Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Company — required field */}
          <div className="space-y-1.5">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              name="company"
              placeholder="e.g. Google"
              value={form.company}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role — required field */}
          <div className="space-y-1.5">
            <Label htmlFor="role">Role *</Label>
            <Input
              id="role"
              name="role"
              placeholder="e.g. Full Stack Developer"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          {/* Status — dropdown for the current stage of the application */}
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Applied Date — defaults to today; allows the user to backdate entries */}
          <div className="space-y-1.5">
            <Label htmlFor="appliedDate">Applied Date</Label>
            <Input
              id="appliedDate"
              name="appliedDate"
              type="date"
              value={form.appliedDate}
              onChange={handleChange}
            />
          </div>

          {/* Job Description — required; used by AI to tailor resume feedback */}
          <div className="space-y-1.5">
            <Label htmlFor="jobDescription">Job Description *</Label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              placeholder="Paste the job description here..."
              value={form.jobDescription}
              onChange={handleChange}
              rows={3}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-blue-500 resize-none"
            />
          </div>

          {/* Notes — optional free-text field for personal reminders */}
          <div className="space-y-1.5">
            <Label htmlFor="note">Notes</Label>
            <Input
              id="note"
              name="note"
              placeholder="Any additional notes..."
              value={form.note}
              onChange={handleChange}
            />
          </div>

          {/* Inline error message — shown only when an error is present */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Action buttons — Cancel dismisses the dialog; Submit POSTs the form */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-sky-blue-600 hover:bg-sky-blue-700 text-white"
            >
              {/* Show a loading label while the request is in-flight */}
              {loading ? "Adding..." : "Add Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
