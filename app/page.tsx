'use client';

import { useState, useEffect } from 'react';
import { FiSave, FiRefreshCw, FiDownload } from 'react-icons/fi';
import JsonInput from '@/components/JsonInput';
import DataPreview from '@/components/DataPreview';
import HistoryPanel from '@/components/HistoryPanel';
import ThemeToggle from '@/components/ThemeToggle';
import { saveData, loadData, exportData, getStorageInfo, type StorageItem } from '@/lib/storage';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { theme } = useTheme();
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
    <div className={theme === 'flowbite' ? 'min-h-screen bg-gray-50 dark:bg-gray-900' : 'min-h-screen bg-base-100'}>
      {/* Header */}
      <header className={theme === 'flowbite' ? 'bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700' : 'bg-base-200 shadow-lg'}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className={`text-3xl font-bold ${theme === 'flowbite' ? 'text-gray-900 dark:text-white' : ''}`}>
                文件上傳與 JSON 數據管理系統
              </h1>
              <p className={`mt-1 ${theme === 'flowbite' ? 'text-gray-500 dark:text-gray-400' : 'text-base-content/60'}`}>
                支持文件上傳、JSON 數據導入、預覽和保存功能
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Storage Info */}
              {theme === 'flowbite' ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-3">
                  <div className="text-xs font-medium text-blue-800 dark:text-blue-400 mb-1">存儲使用</div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-300">{storageInfo.usedFormatted}</div>
                  <div className="w-20 bg-blue-200 dark:bg-blue-800 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${storageInfo.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
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
              )}
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
            <section className={theme === 'flowbite' ? 'bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700' : 'card bg-base-200 shadow-xl'}>
              <div className={theme === 'flowbite' ? 'p-6' : 'card-body'}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                  <h2 className={theme === 'flowbite' ? 'text-xl font-bold text-gray-900 dark:text-white' : 'card-title'}>
                    步驟 1: 輸入數據
                  </h2>
                  {parsedData && (
                    <div className="flex gap-2">
                      {theme === 'flowbite' ? (
                        <>
                          <button
                            onClick={handleExport}
                            className="px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                          >
                            <FiDownload />
                            導出
                          </button>
                          <button
                            onClick={handleReset}
                            className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                          >
                            <FiRefreshCw />
                            重置
                          </button>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                  )}
                </div>
                <JsonInput onJsonParse={handleJsonParse} />
              </div>
            </section>

            {/* Preview Section */}
            {parsedData && (
              <section className={theme === 'flowbite' ? 'bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700' : 'card bg-base-200 shadow-xl'}>
                <div className={theme === 'flowbite' ? 'p-6' : 'card-body'}>
                  <h2 className={`mb-4 ${theme === 'flowbite' ? 'text-xl font-bold text-gray-900 dark:text-white' : 'card-title'}`}>
                    步驟 2: 預覽數據
                  </h2>
                  <DataPreview data={parsedData} onSave={handleSave} />
                </div>
              </section>
            )}
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-1">
            <div className={`sticky top-4 ${theme === 'flowbite' ? 'bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700' : 'card bg-base-200 shadow-xl'}`}>
              <div className={theme === 'flowbite' ? 'p-6' : 'card-body'}>
                <HistoryPanel onLoadItem={handleLoadHistoryItem} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Save Modal */}
      {showSaveModal && (
        <>
          {theme === 'flowbite' ? (
            <>
              {/* Flowbite Modal */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 dark:bg-gray-900/80">
                <div className="relative bg-white rounded-lg shadow-xl dark:bg-gray-800 w-full max-w-md">
                  {/* Modal header */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 rounded-t">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      保存數據
                    </h3>
                    <button
                      onClick={() => {
                        setShowSaveModal(false);
                        setSaveName('');
                      }}
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                      </svg>
                    </button>
                  </div>
                  {/* Modal body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        為此數據命名（可選）
                      </label>
                      <input
                        type="text"
                        placeholder="例如: 用戶列表_2024"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={saveName}
                        onChange={(e) => setSaveName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') confirmSave();
                        }}
                        autoFocus
                      />
                    </div>
                  </div>
                  {/* Modal footer */}
                  <div className="flex items-center gap-3 p-6 border-t border-gray-200 dark:border-gray-700 rounded-b">
                    <button
                      onClick={() => {
                        setShowSaveModal(false);
                        setSaveName('');
                      }}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={confirmSave}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center gap-2 transition-colors"
                    >
                      <FiSave />
                      確認保存
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
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
        </>
      )}

      {/* Footer */}
      <footer className={theme === 'flowbite' ? 'bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16' : 'footer footer-center p-4 bg-base-200 text-base-content mt-16'}>
        <div className={theme === 'flowbite' ? 'text-center p-4' : ''}>
          <p className={theme === 'flowbite' ? 'text-sm text-gray-500 dark:text-gray-400' : ''}>
            文件上傳與 JSON 數據管理系統 - Built with Next.js, Tailwind CSS, DaisyUI & Flowbite
          </p>
        </div>
      </footer>
    </div>
  );
}
