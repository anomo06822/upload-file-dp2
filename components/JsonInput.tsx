'use client';

import { useState } from 'react';
import { FiCode, FiCheck } from 'react-icons/fi';
import FileUpload from './FileUpload';

interface JsonInputProps {
  onJsonParse: (data: any) => void;
}

export default function JsonInput({ onJsonParse }: JsonInputProps) {
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

  return (
    <div className="w-full space-y-4">
      {/* Mode Toggle */}
      <div className="tabs tabs-boxed w-fit">
        <button
          className={`tab ${inputMode === 'file' ? 'tab-active' : ''}`}
          onClick={() => setInputMode('file')}
        >
          文件上傳
        </button>
        <button
          className={`tab ${inputMode === 'text' ? 'tab-active' : ''}`}
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
              className={`textarea textarea-bordered w-full h-64 font-mono text-sm ${
                error ? 'textarea-error' : isValid ? 'textarea-success' : ''
              }`}
              placeholder="在此處粘貼或輸入 JSON 數據...&#10;&#10;範例:&#10;{&#10;  &quot;name&quot;: &quot;張三&quot;,&#10;  &quot;age&quot;: 30&#10;}"
              value={jsonText}
              onChange={handleTextChange}
            />
            {isValid && (
              <div className="absolute top-2 right-2">
                <FiCheck className="text-2xl text-success" />
              </div>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleParse}
              className="btn btn-primary btn-sm"
              disabled={!jsonText.trim()}
            >
              <FiCode className="mr-1" />
              解析 JSON
            </button>
            <button
              onClick={formatJson}
              className="btn btn-outline btn-sm"
              disabled={!jsonText.trim()}
            >
              格式化
            </button>
            <button
              onClick={clearInput}
              className="btn btn-ghost btn-sm"
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
            <h3 className="font-medium">文件內容預覽</h3>
            <button
              onClick={formatJson}
              className="btn btn-outline btn-xs"
            >
              格式化
            </button>
          </div>
          <pre className={`p-4 rounded-lg bg-base-200 overflow-auto max-h-64 text-sm ${
            error ? 'border-2 border-error' : isValid ? 'border-2 border-success' : ''
          }`}>
            <code>{jsonText}</code>
          </pre>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {isValid && !error && (
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
