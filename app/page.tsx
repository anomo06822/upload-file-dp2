'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiDownload } from 'react-icons/fi';
import JsonInput from '@/components/JsonInput';
import DataPreview from '@/components/DataPreview';
import HistoryPanel from '@/components/HistoryPanel';
import { saveData, loadData, exportData, getStorageInfo, type StorageItem } from '@/lib/storage';

export default function Home() {
  const [parsedData, setParsedData] = useState<any>(null);
  const [savedItem, setSavedItem] = useState<StorageItem | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [storageInfo, setStorageInfo] = useState({ used: 0, percentage: 0, usedFormatted: '0 KB' });

  useEffect(() => {
    // Load existing data on mount
    const existing = loadData();
    if (existing) {
      setSavedItem(existing);
      setParsedData(existing.data);
    }

    // Update storage info
    updateStorageInfo();
  }, []);

  const updateStorageInfo = () => {
    setStorageInfo(getStorageInfo());
  };

  const handleJsonParse = (data: any) => {
    setParsedData(data);
  };

  const handleSave = () => {
    if (!parsedData) return;
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    if (!parsedData) return;

    const name = saveName.trim() || 'Untitled';
    const item = saveData(parsedData, name);
    setSavedItem(item);
    setShowSaveModal(false);
    setSaveName('');
    updateStorageInfo();

    // Show success message
    const toast = document.createElement('div');
    toast.className = 'toast toast-top toast-end';
    toast.innerHTML = `
      <div class="alert alert-success">
        <span>數據已成功保存！</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const handleLoadHistoryItem = (item: StorageItem) => {
    setParsedData(item.data);
    setSavedItem(item);
  };

  const handleExport = () => {
    if (!parsedData) return;
    const filename = savedItem?.name
      ? `${savedItem.name.replace(/[^a-z0-9]/gi, '_')}.json`
      : 'export.json';
    exportData(parsedData, filename);
  };

  const handleReset = () => {
    if (confirm('確定要清除當前數據嗎？')) {
      setParsedData(null);
      setSavedItem(null);
      setSaveName('');
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="bg-base-200 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">文件上傳與 JSON 數據管理系統</h1>
              <p className="text-base-content/60 mt-1">
                支持文件上傳、JSON 數據導入、預覽和保存功能
              </p>
            </div>
            <div className="stats shadow">
              <div className="stat py-2 px-4">
                <div className="stat-title text-xs">存儲使用</div>
                <div className="stat-value text-lg">{storageInfo.usedFormatted}</div>
                <div className="stat-desc">
                  <progress
                    className="progress progress-primary w-20"
                    value={storageInfo.percentage}
                    max="100"
                  ></progress>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-8">
            {/* JSON Input Section */}
            <section className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="card-title">步驟 1: 輸入數據</h2>
                  {parsedData && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleExport}
                        className="btn btn-sm btn-outline"
                      >
                        <FiDownload className="mr-1" />
                        導出
                      </button>
                      <button
                        onClick={handleReset}
                        className="btn btn-sm btn-ghost"
                      >
                        <FiRefreshCw className="mr-1" />
                        重置
                      </button>
                    </div>
                  )}
                </div>
                <JsonInput onJsonParse={handleJsonParse} />
              </div>
            </section>

            {/* Preview Section */}
            {parsedData && (
              <section className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-4">步驟 2: 預覽數據</h2>
                  <DataPreview data={parsedData} onSave={handleSave} />
                </div>
              </section>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <div className="card bg-base-200 shadow-xl sticky top-4">
              <div className="card-body">
                <HistoryPanel onLoadItem={handleLoadHistoryItem} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">保存數據</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">為此數據命名（可選）</span>
              </label>
              <input
                type="text"
                placeholder="例如: 用戶列表_2024"
                className="input input-bordered"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmSave();
                }}
                autoFocus
              />
            </div>
            <div className="modal-action">
              <button
                onClick={() => {
                  setShowSaveModal(false);
                  setSaveName('');
                }}
                className="btn btn-ghost"
              >
                取消
              </button>
              <button onClick={confirmSave} className="btn btn-primary">
                <FiSave className="mr-1" />
                確認保存
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowSaveModal(false)}></div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content mt-16">
        <aside>
          <p>文件上傳與 JSON 數據管理系統 - Built with Next.js, Tailwind CSS & DaisyUI</p>
        </aside>
      </footer>
    </div>
  );
}
