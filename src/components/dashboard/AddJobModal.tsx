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

interface AddJobModalProps {
  onJobAdded: (job: any) => void;
}

export default function AddJobModal({ onJobAdded }: AddJobModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    jobDescription: "",
    note: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      onJobAdded(data.data); // update parent state
      setOpen(false);
      setForm({
        company: "",
        role: "",
        status: "applied",
        jobDescription: "",
        note: "",
        appliedDate: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      setError("Failed to add job. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sky-blue-600 hover:bg-sky-blue-700 text-white gap-2">
          <Plus size={16} />
          Add Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Company */}
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

          {/* Role */}
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

          {/* Status */}
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

          {/* Applied Date */}
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

          {/* Job Description */}
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

          {/* Notes */}
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

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
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
              {loading ? "Adding..." : "Add Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
