'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import { getHistory, deleteHistoryItem, clearHistory, exportData, type StorageItem } from '@/lib/storage';
import { useTheme } from '@/contexts/ThemeContext';

interface HistoryPanelProps {
  onLoadItem: (item: StorageItem) => void;
}

export default function HistoryPanel({ onLoadItem }: HistoryPanelProps) {
  const { theme } = useTheme();
  const [history, setHistory] = useState<StorageItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const items = getHistory();
    setHistory(items);
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    loadHistory();
  };

  const handleClearAll = () => {
    if (confirm('確定要清除所有歷史記錄嗎？')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleExport = (item: StorageItem) => {
    const filename = `${item.name.replace(/[^a-z0-9]/gi, '_')}_${new Date(item.timestamp).toISOString().split('T')[0]}.json`;
    exportData(item.data, filename);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  if (history.length === 0) {
    return (
      <div className={theme === 'flowbite' ? 'text-center py-8' : 'card bg-base-200'}>
        <div className={theme === 'flowbite' ? '' : 'card-body text-center'}>
          <FiClock className={`mx-auto text-4xl ${theme === 'flowbite' ? 'text-gray-400 dark:text-gray-500' : 'text-base-content/40'}`} />
          <p className={theme === 'flowbite' ? 'text-gray-500 dark:text-gray-400 mt-2' : 'text-base-content/60'}>
            暫無歷史記錄
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${theme === 'flowbite' ? 'text-gray-900 dark:text-white' : ''}`}>
          <FiClock />
          上傳歷史
          {theme === 'flowbite' ? (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-100 bg-blue-600 rounded-full">
              {history.length}
            </span>
          ) : (
            <span className="badge badge-primary">{history.length}</span>
          )}
        </h2>
        {theme === 'flowbite' ? (
          <button
            onClick={handleClearAll}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 transition-colors"
          >
            清除全部
          </button>
        ) : (
          <button
            onClick={handleClearAll}
            className="btn btn-error btn-sm"
          >
            清除全部
          </button>
        )}
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className={
              theme === 'flowbite'
                ? 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors'
                : 'card bg-base-200 hover:bg-base-300 transition-colors'
            }
          >
            <div className={theme === 'flowbite' ? 'p-4' : 'card-body p-4'}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium truncate ${theme === 'flowbite' ? 'text-gray-900 dark:text-white' : ''}`}>
                    {item.name}
                  </h3>
                  <div className={`text-sm space-y-1 mt-1 ${theme === 'flowbite' ? 'text-gray-500 dark:text-gray-400' : 'text-base-content/60'}`}>
                    <p>{formatDate(item.timestamp)}</p>
                    <p>大小: {formatSize(item.size)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {theme === 'flowbite' ? (
                    <>
                      <button
                        onClick={() => onLoadItem(item)}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                        title="預覽"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleExport(item)}
                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                        title="下載"
                      >
                        <FiDownload />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                        title="刪除"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onLoadItem(item)}
                        className="btn btn-sm btn-ghost"
                        title="預覽"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleExport(item)}
                        className="btn btn-sm btn-ghost"
                        title="下載"
                      >
                        <FiDownload />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn btn-sm btn-ghost text-error"
                        title="刪除"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
