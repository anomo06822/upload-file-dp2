'use client';

import { useState, useCallback } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedTypes?: string;
  maxSize?: number; // in bytes
}

export default function FileUpload({
  onFileSelect,
  acceptedTypes = '.json,application/json',
  maxSize = 5 * 1024 * 1024 // 5MB default
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const validateFile = useCallback((file: File): boolean => {
    setError('');

    // Check file size
    if (file.size > maxSize) {
      setError(`文件大小超過限制（最大 ${(maxSize / 1024 / 1024).toFixed(2)} MB）`);
      return false;
    }

    // Check file type
    if (acceptedTypes && !acceptedTypes.includes(file.type) && !file.name.endsWith('.json')) {
      setError('僅支持 JSON 格式文件');
      return false;
    }

    return true;
  }, [maxSize, acceptedTypes]);

  const handleFile = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [validateFile, onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/10'
            : error
            ? 'border-error bg-error/10'
            : 'border-base-300 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={acceptedTypes}
          onChange={handleFileInput}
        />

        {!selectedFile ? (
          <div className="space-y-4">
            <FiUpload className="mx-auto text-5xl text-base-content/40" />
            <div>
              <p className="text-lg font-medium mb-2">
                拖拽文件到此處或點擊選擇
              </p>
              <p className="text-sm text-base-content/60">
                支持 JSON 格式，最大 {(maxSize / 1024 / 1024).toFixed(0)} MB
              </p>
            </div>
            <label htmlFor="file-upload" className="btn btn-primary btn-sm">
              選擇文件
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <FiFile className="mx-auto text-5xl text-success" />
            <div>
              <p className="font-medium">{selectedFile.name}</p>
              <p className="text-sm text-base-content/60">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={clearFile}
              className="btn btn-error btn-sm"
            >
              <FiX className="mr-1" />
              清除
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
