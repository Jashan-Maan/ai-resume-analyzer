"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export default function FileUpload({
  onFileSelect,
  selectedFile,
  onClear,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type == "application/pdf") {
      onFileSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  if (selectedFile) {
    return (
      <div className="border-2 border-violet-200 bg-violet-50 rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-violet-100 p-2.5 rounded-lg">
            <FileText size={20} className="text-violet-600" />
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
        >
          <X size={18} />
        </button>
      </div>
    );
  }

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
            ? "border-violet-500 bg-violet-50"
            : "border-gray-200 hover:border-violet-400 hover:bg-gray-50"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
      />
      <div className="bg-violet-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
        <Upload size={24} className="text-violet-600" />
      </div>
      <p className="font-medium text-gray-800 mb-1">Drop your resume here</p>
      <p className="text-sm text-gray-400 mb-3">or click to browse files</p>
      <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
        PDF only · Max 4MB
      </span>
    </div>
  );
}
