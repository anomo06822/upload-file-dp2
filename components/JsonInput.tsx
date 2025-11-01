'use client';

import { useState } from 'react';
import { FiCode, FiCheck } from 'react-icons/fi';
import FileUpload from './FileUpload';
import { useTheme } from '@/contexts/ThemeContext';

interface JsonInputProps {
  onJsonParse: (data: any) => void;
}

export default function JsonInput({ onJsonParse }: JsonInputProps) {
  const { theme } = useTheme();
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string>('');
  const [isValid, setIsValid] = useState(false);

  const validateAndParseJson = (text: string): boolean => {
    setError('');
    setIsValid(false);

    if (!text.trim()) {
      setError('JSON 內容不能為空');
      return false;
    }

    try {
      const parsed = JSON.parse(text);
      setIsValid(true);
      onJsonParse(parsed);
      return true;
    } catch (err) {
      setError(`JSON 格式錯誤: ${(err as Error).message}`);
      return false;
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      setJsonText(text);
      validateAndParseJson(text);
    } catch (err) {
      setError(`讀取文件失敗: ${(err as Error).message}`);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJsonText(text);

    // Auto-validate if text is not empty
    if (text.trim()) {
      validateAndParseJson(text);
    } else {
      setError('');
      setIsValid(false);
    }
  };

  const handleParse = () => {
    validateAndParseJson(jsonText);
  };

  const clearInput = () => {
    setJsonText('');
    setError('');
    setIsValid(false);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setIsValid(true);
      setError('');
    } catch (err) {
      setError(`無法格式化: ${(err as Error).message}`);
    }
  };

  const getTabClasses = (isActive: boolean) => {
    if (theme === 'flowbite') {
      return `px-4 py-2 text-sm font-medium rounded-lg ${
        isActive
          ? 'text-blue-600 bg-blue-50 dark:text-blue-500 dark:bg-gray-800'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      } transition-colors`;
    }
    return `tab ${isActive ? 'tab-active' : ''}`;
  };

  const getButtonClasses = (variant: 'primary' | 'outline' | 'ghost' = 'primary') => {
    if (theme === 'flowbite') {
      if (variant === 'primary') {
        return 'px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition-colors inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
      } else if (variant === 'outline') {
        return 'px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
      }
      return 'px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    }
    return variant === 'primary' ? 'btn btn-primary btn-sm' : variant === 'outline' ? 'btn btn-outline btn-sm' : 'btn btn-ghost btn-sm';
  };

  const getTextareaClasses = () => {
    if (theme === 'flowbite') {
      return `w-full h-64 font-mono text-sm p-4 rounded-lg border ${
        error
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10 dark:border-red-500'
          : isValid
          ? 'border-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-500'
          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
      } text-gray-900 dark:text-white focus:ring-4 ${
        error ? 'focus:ring-red-300 dark:focus:ring-red-800' : 'focus:ring-blue-300 dark:focus:ring-blue-800'
      } focus:border-blue-500 transition-colors`;
    }
    return `textarea textarea-bordered w-full h-64 font-mono text-sm ${
      error ? 'textarea-error' : isValid ? 'textarea-success' : ''
    }`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Mode Toggle */}
      <div className={theme === 'flowbite' ? 'flex gap-2' : 'tabs tabs-boxed w-fit'}>
        <button
          className={getTabClasses(inputMode === 'file')}
          onClick={() => setInputMode('file')}
        >
          文件上傳
        </button>
        <button
          className={getTabClasses(inputMode === 'text')}
          onClick={() => setInputMode('text')}
        >
          直接輸入
        </button>
      </div>

      {/* File Upload Mode */}
      {inputMode === 'file' && (
        <FileUpload onFileSelect={handleFileSelect} />
      )}

      {/* Text Input Mode */}
      {inputMode === 'text' && (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              className={getTextareaClasses()}
              placeholder="在此處粘貼或輸入 JSON 數據...&#10;&#10;範例:&#10;{&#10;  &quot;name&quot;: &quot;張三&quot;,&#10;  &quot;age&quot;: 30&#10;}"
              value={jsonText}
              onChange={handleTextChange}
            />
            {isValid && (
              <div className="absolute top-2 right-2">
                <FiCheck className={`text-2xl ${theme === 'flowbite' ? 'text-green-500' : 'text-success'}`} />
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleParse}
              className={getButtonClasses('primary')}
              disabled={!jsonText.trim()}
            >
              <FiCode />
              解析 JSON
            </button>
            <button
              onClick={formatJson}
              className={getButtonClasses('outline')}
              disabled={!jsonText.trim()}
            >
              格式化
            </button>
            <button
              onClick={clearInput}
              className={getButtonClasses('ghost')}
              disabled={!jsonText.trim()}
            >
              清除
            </button>
          </div>
        </div>
      )}

      {/* Display JSON Text in File Mode */}
      {inputMode === 'file' && jsonText && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className={`font-medium ${theme === 'flowbite' ? 'text-gray-900 dark:text-white' : ''}`}>文件內容預覽</h3>
            <button
              onClick={formatJson}
              className={theme === 'flowbite' ? 'px-3 py-1.5 text-xs font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition-colors' : 'btn btn-outline btn-xs'}
            >
              格式化
            </button>
          </div>
          <pre className={
            theme === 'flowbite'
              ? `p-4 rounded-lg overflow-auto max-h-64 text-sm border-2 ${
                  error
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                    : isValid
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                    : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800'
                } text-gray-900 dark:text-white`
              : `p-4 rounded-lg bg-base-200 overflow-auto max-h-64 text-sm ${
                  error ? 'border-2 border-error' : isValid ? 'border-2 border-success' : ''
                }`
          }>
            <code>{jsonText}</code>
          </pre>
        </div>
      )}

      {/* Error Display */}
      {error && theme === 'flowbite' ? (
        <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 flex items-center gap-3" role="alert">
          <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <span>{error}</span>
        </div>
      ) : error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {isValid && !error && theme === 'flowbite' ? (
        <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 flex items-center gap-3" role="alert">
          <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          <span>JSON 格式正確，可以進行預覽</span>
        </div>
      ) : isValid && !error && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>JSON 格式正確，可以進行預覽</span>
        </div>
      )}
    </div>
  );
}
