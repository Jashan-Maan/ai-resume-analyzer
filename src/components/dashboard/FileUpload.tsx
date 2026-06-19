"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

/**
 * Properties for the FileUpload component.
 */
interface FileUploadProps {
  /** Callback fired when a valid PDF file is selected. */
  onFileSelect: (file: File) => void;
  /** Currently selected file, or null if no file is chosen yet. */
  selectedFile: File | null;
  /** Callback fired to clear the selected file and reset the uploader. */
  onClear: () => void;
}

/**
 * FileUpload component provides a drag-and-drop area for uploading PDF resumes.
 * It also supports opening the native file browser when clicked.
 */
export default function FileUpload({
  onFileSelect,
  selectedFile,
  onClear,
}: FileUploadProps) {
  // State to track whether a file is currently being dragged over the upload area
  const [isDragging, setIsDragging] = useState(false);
  
  // Reference to the hidden file input element to trigger it programmatically
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles dropping a file onto the target area.
   * Only accepts the file if it is a PDF.
   */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type == "application/pdf") {
      onFileSelect(file);
    }
  };

  /**
   * Handles changes to the hidden file input (triggered via click-to-browse).
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  // If a file is already selected, render a preview of the file with a clear/remove button
  if (selectedFile) {
    return (
      <div className="border-2 border-sky-blue-200 bg-sky-blue-50 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-sky-blue-100 p-2.5 rounded-lg">
            <FileText size={20} className="text-sky-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-red-500 transition p-1"
          aria-label="Remove selected file"
        >
          <X size={18} />
        </button>
      </div>
    );
  }

  // Otherwise, render the drag-and-drop file upload target zone
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
        ${
          isDragging
            ? "border-sky-blue-500 bg-sky-blue-50"
            : "border-gray-200 hover:border-sky-blue-400 hover:bg-gray-50"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />
      <div className="bg-sky-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
        <Upload size={24} className="text-sky-blue-600" />
      </div>
      <p className="font-medium text-gray-800 mb-1">Drop your resume here</p>
      <p className="text-sm text-gray-400 mb-3">or click to browse files</p>
      <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
        PDF only · Max 4MB
      </span>
    </div>
  );
}
