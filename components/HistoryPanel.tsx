'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiTrash2, FiDownload, FiEye } from 'react-icons/fi';
import { getHistory, deleteHistoryItem, clearHistory, exportData, type StorageItem } from '@/lib/storage';

interface HistoryPanelProps {
  onLoadItem: (item: StorageItem) => void;
}

export default function HistoryPanel({ onLoadItem }: HistoryPanelProps) {
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
      <div className="card bg-base-200">
        <div className="card-body text-center">
          <FiClock className="mx-auto text-4xl text-base-content/40" />
          <p className="text-base-content/60">暫無歷史記錄</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FiClock />
          上傳歷史
          <span className="badge badge-primary">{history.length}</span>
        </h2>
        <button
          onClick={handleClearAll}
          className="btn btn-error btn-sm"
        >
          清除全部
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div key={item.id} className="card bg-base-200 hover:bg-base-300 transition-colors">
            <div className="card-body p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <div className="text-sm text-base-content/60 space-y-1 mt-1">
                    <p>{formatDate(item.timestamp)}</p>
                    <p>大小: {formatSize(item.size)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
