'use client';

import { useState, useCallback } from 'react';
import { FiUpload, FiFile, FiX } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();
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

  // Dynamic styles based on theme
  const getContainerClasses = () => {
    if (theme === 'flowbite') {
      return `relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
          : error
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-gray-800'
      }`;
    }
    return `relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
      isDragging
        ? 'border-primary bg-primary/10'
        : error
        ? 'border-error bg-error/10'
        : 'border-base-300 hover:border-primary/50'
    }`;
  };

  const getButtonClasses = () => {
    if (theme === 'flowbite') {
      return 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors';
    }
    return 'btn btn-primary btn-sm';
  };

  const getClearButtonClasses = () => {
    if (theme === 'flowbite') {
      return 'px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 transition-colors inline-flex items-center gap-2';
    }
    return 'btn btn-error btn-sm';
  };

  return (
    <div className="w-full">
      <div
        className={getContainerClasses()}
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
            <FiUpload className={`mx-auto text-5xl ${theme === 'flowbite' ? 'text-gray-400 dark:text-gray-500' : 'text-base-content/40'}`} />
            <div>
              <p className={`text-lg font-medium mb-2 ${theme === 'flowbite' ? 'text-gray-900 dark:text-white' : ''}`}>
                拖拽文件到此處或點擊選擇
              </p>
              <p className={`text-sm ${theme === 'flowbite' ? 'text-gray-500 dark:text-gray-400' : 'text-base-content/60'}`}>
                支持 JSON 格式，最大 {(maxSize / 1024 / 1024).toFixed(0)} MB
              </p>
            </div>
            <label htmlFor="file-upload" className={getButtonClasses()}>
              選擇文件
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <FiFile className={`mx-auto text-5xl ${theme === 'flowbite' ? 'text-green-500' : 'text-success'}`} />
            <div>
              <p className={`font-medium ${theme === 'flowbite' ? 'text-gray-900 dark:text-white' : ''}`}>{selectedFile.name}</p>
              <p className={`text-sm ${theme === 'flowbite' ? 'text-gray-500 dark:text-gray-400' : 'text-base-content/60'}`}>
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={clearFile}
              className={getClearButtonClasses()}
            >
              <FiX className="mr-1" />
              清除
            </button>
          </div>
        )}
      </div>

      {error && theme === 'flowbite' ? (
        <div className="mt-4 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 flex items-center gap-3" role="alert">
          <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <span>{error}</span>
        </div>
      ) : error && (
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
