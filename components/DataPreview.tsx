'use client';

import { useState, useEffect, useMemo } from 'react';
import { FiChevronDown, FiChevronRight, FiCopy, FiCheck, FiFilter, FiX } from 'react-icons/fi';

interface DataPreviewProps {
  data: any;
  onSave?: () => void;
}

// Field Analysis Types
interface FieldInfo {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array' | 'null' | 'mixed';
  uniqueValues: Set<any>;
  uniqueCount: number;
  nullCount: number;
  min?: number;
  max?: number;
  sample?: any;
}

interface FilterCondition {
  field: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  value: any;
}

type FilterMap = Record<string, FilterCondition>;

export default function DataPreview({ data, onSave }: DataPreviewProps) {
  const [viewMode, setViewMode] = useState<'tree' | 'json' | 'table'>('tree');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) {
    return (
      <div className="card bg-base-200">
        <div className="card-body items-center text-center">
          <p className="text-base-content/60">暫無數據可預覽</p>
          <p className="text-sm text-base-content/40">請先上傳或輸入 JSON 數據</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">數據預覽</h2>
        <div className="flex gap-2">
          <div className="btn-group">
            <button
              className={`btn btn-sm ${viewMode === 'tree' ? 'btn-active' : ''}`}
              onClick={() => setViewMode('tree')}
            >
              樹狀視圖
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'json' ? 'btn-active' : ''}`}
              onClick={() => setViewMode('json')}
            >
              JSON 視圖
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              表格視圖
            </button>
          </div>
          <button
            onClick={copyToClipboard}
            className="btn btn-sm btn-ghost"
            title="複製 JSON"
          >
            {copied ? <FiCheck className="text-success" /> : <FiCopy />}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="card bg-base-200">
        <div className="card-body">
          {viewMode === 'tree' ? (
            <TreeView data={data} />
          ) : viewMode === 'json' ? (
            <pre className="overflow-auto max-h-96 text-sm">
              <code>{JSON.stringify(data, null, 2)}</code>
            </pre>
          ) : (
            <TableView data={data} />
          )}
        </div>
      </div>

      {/* Data Statistics */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">數據類型</div>
          <div className="stat-value text-2xl">{getDataType(data)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">項目數量</div>
          <div className="stat-value text-2xl">{getItemCount(data)}</div>
        </div>
        <div className="stat">
          <div className="stat-title">數據大小</div>
          <div className="stat-value text-2xl">
            {(JSON.stringify(data).length / 1024).toFixed(2)} KB
          </div>
        </div>
      </div>

      {/* Save Button */}
      {onSave && (
        <div className="flex justify-end">
          <button onClick={onSave} className="btn btn-primary">
            確認保存數據
          </button>
        </div>
      )}
    </div>
  );
}

// Tree View Component
function TreeView({ data, level = 0 }: { data: any; level?: number }) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (value: any, key: string, depth: number) => {
    const isExpandable = typeof value === 'object' && value !== null;
    const isExpanded = expanded[key] || false;

    if (!isExpandable) {
      return (
        <div className="ml-4 flex items-center gap-2">
          <span className="font-medium text-primary">{key}:</span>
          <span className="text-base-content">
            {typeof value === 'string' ? `"${value}"` : String(value)}
          </span>
          <span className="badge badge-sm badge-ghost">
            {typeof value}
          </span>
        </div>
      );
    }

    const itemCount = Array.isArray(value) ? value.length : Object.keys(value).length;

    return (
      <div className="ml-4">
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-base-300 rounded p-1"
          onClick={() => toggleExpand(key)}
        >
          {isExpanded ? (
            <FiChevronDown className="text-lg" />
          ) : (
            <FiChevronRight className="text-lg" />
          )}
          <span className="font-medium text-primary">{key}:</span>
          <span className="badge badge-sm">
            {Array.isArray(value) ? 'Array' : 'Object'}
          </span>
          <span className="text-sm text-base-content/60">({itemCount} items)</span>
        </div>
        {isExpanded && (
          <div className="ml-4 border-l-2 border-base-300 pl-2 mt-1">
            <TreeView data={value} level={depth + 1} />
          </div>
        )}
      </div>
    );
  };

  if (Array.isArray(data)) {
    return (
      <div className="space-y-1">
        {data.map((item, index) => (
          <div key={index}>
            {renderValue(item, `[${index}]`, level)}
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
    return (
      <div className="space-y-1">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            {renderValue(value, key, level)}
          </div>
        ))}
      </div>
    );
  }

  return <div className="text-base-content">{String(data)}</div>;
}

// Helper Functions
function getDataType(data: any): string {
  if (Array.isArray(data)) return 'Array';
  if (data === null) return 'Null';
  return typeof data === 'object' ? 'Object' : typeof data;
}

function getItemCount(data: any): number {
  if (Array.isArray(data)) return data.length;
  if (typeof data === 'object' && data !== null) return Object.keys(data).length;
  return 1;
}

// Flatten nested objects into dot notation paths
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        // Recursively flatten nested objects
        Object.assign(flattened, flattenObject(value, newKey));
      } else if (Array.isArray(value)) {
        // Convert arrays to JSON string for display
        flattened[newKey] = JSON.stringify(value);
      } else {
        flattened[newKey] = value;
      }
    }
  }

  return flattened;
}

// Extract all unique keys from an array of objects
function extractAllKeys(data: any[]): string[] {
  const keysSet = new Set<string>();

  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      const flattened = flattenObject(item);
      Object.keys(flattened).forEach(key => keysSet.add(key));
    }
  });

  return Array.from(keysSet).sort();
}

// Analyze field information from flattened data
function analyzeFields(flattenedData: Record<string, any>[]): Map<string, FieldInfo> {
  const fieldsMap = new Map<string, FieldInfo>();

  // Get all unique field names
  const allFields = new Set<string>();
  flattenedData.forEach(row => {
    Object.keys(row).forEach(key => allFields.add(key));
  });

  // Analyze each field
  allFields.forEach(fieldName => {
    const values: any[] = [];
    const uniqueValues = new Set<any>();
    let nullCount = 0;
    const types = new Set<string>();

    flattenedData.forEach(row => {
      const value = row[fieldName];

      if (value === null || value === undefined) {
        nullCount++;
        types.add('null');
      } else {
        values.push(value);
        uniqueValues.add(value);

        // Detect type
        if (typeof value === 'number') {
          types.add('number');
        } else if (typeof value === 'boolean') {
          types.add('boolean');
        } else if (typeof value === 'string') {
          // Check if it's a date string
          const datePattern = /^\d{4}-\d{2}-\d{2}/;
          if (datePattern.test(value)) {
            types.add('date');
          } else {
            types.add('string');
          }
        } else if (Array.isArray(value)) {
          types.add('array');
        } else if (typeof value === 'object') {
          types.add('object');
        }
      }
    });

    // Determine primary type
    let primaryType: FieldInfo['type'] = 'string';
    if (types.size === 1) {
      primaryType = Array.from(types)[0] as FieldInfo['type'];
    } else if (types.size > 1) {
      // Mixed types - prefer the most common non-null type
      if (types.has('number')) primaryType = 'number';
      else if (types.has('string')) primaryType = 'string';
      else if (types.has('boolean')) primaryType = 'boolean';
      else primaryType = 'mixed';
    }

    // Calculate min/max for numbers
    let min: number | undefined;
    let max: number | undefined;
    if (primaryType === 'number') {
      const numValues = values.filter(v => typeof v === 'number') as number[];
      if (numValues.length > 0) {
        min = Math.min(...numValues);
        max = Math.max(...numValues);
      }
    }

    fieldsMap.set(fieldName, {
      name: fieldName,
      type: primaryType,
      uniqueValues,
      uniqueCount: uniqueValues.size,
      nullCount,
      min,
      max,
      sample: values[0]
    });
  });

  return fieldsMap;
}

// Apply filters to data
function applyFilters(
  data: Record<string, any>[],
  filters: FilterMap,
  fieldsInfo: Map<string, FieldInfo>
): Record<string, any>[] {
  if (Object.keys(filters).length === 0) {
    return data;
  }

  return data.filter(row => {
    return Object.entries(filters).every(([fieldName, filter]) => {
      const value = row[fieldName];
      const fieldInfo = fieldsInfo.get(fieldName);

      if (!fieldInfo) return true;

      // Handle null/undefined values
      if (value === null || value === undefined) {
        return filter.value === null || filter.value === undefined || filter.value === '';
      }

      switch (filter.type) {
        case 'text':
          // Case-insensitive text search
          const searchTerm = String(filter.value).toLowerCase();
          if (!searchTerm) return true;
          return String(value).toLowerCase().includes(searchTerm);

        case 'number':
          // Range filter: {min: number, max: number}
          if (!filter.value) return true;
          const numValue = typeof value === 'number' ? value : parseFloat(String(value));
          if (isNaN(numValue)) return false;

          const { min, max } = filter.value;
          if (min !== undefined && min !== '' && numValue < min) return false;
          if (max !== undefined && max !== '' && numValue > max) return false;
          return true;

        case 'boolean':
          // Boolean filter
          if (filter.value === 'all') return true;
          return value === (filter.value === 'true' || filter.value === true);

        case 'select':
          // Multi-select filter (array of values)
          if (!filter.value || filter.value.length === 0) return true;
          return filter.value.includes(value);

        default:
          return true;
      }
    });
  });
}

// Table View Component
interface TableViewProps {
  data: any;
}

function TableView({ data }: TableViewProps) {
  const STORAGE_KEY = 'dataPreview_visibleFields';

  // Convert data to array if it's an object
  const dataArray = useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      return [data];
    }
    return [];
  }, [data]);

  // Extract all possible columns
  const allColumns = useMemo(() => extractAllKeys(dataArray), [dataArray]);

  // Load visible fields from localStorage
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored visible fields:', e);
        }
      }
    }
    // Default: all fields visible
    return allColumns.reduce((acc, col) => ({ ...acc, [col]: true }), {});
  });

  // Update localStorage when visible fields change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleFields));
    }
  }, [visibleFields]);

  // Ensure all columns have a visibility state
  useEffect(() => {
    const newFields = allColumns.filter(col => !(col in visibleFields));
    if (newFields.length > 0) {
      setVisibleFields(prev => ({
        ...prev,
        ...newFields.reduce((acc, col) => ({ ...acc, [col]: true }), {})
      }));
    }
  }, [allColumns, visibleFields]);

  // Filters state
  const [filters, setFilters] = useState<FilterMap>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Group By state
  const [groupByField, setGroupByField] = useState<string>('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Get visible columns
  const visibleColumns = useMemo(
    () => allColumns.filter(col => visibleFields[col]),
    [allColumns, visibleFields]
  );

  // Flatten all data rows
  const flattenedData = useMemo(
    () => dataArray.map(item => flattenObject(item)),
    [dataArray]
  );

  // Analyze fields
  const fieldsInfo = useMemo(
    () => analyzeFields(flattenedData),
    [flattenedData]
  );

  // Apply filters
  const filteredData = useMemo(
    () => applyFilters(flattenedData, filters, fieldsInfo),
    [flattenedData, filters, fieldsInfo]
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Calculate pagination (on filtered data)
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const paginatedData = useMemo(
    () => filteredData.slice(startIdx, endIdx),
    [filteredData, startIdx, endIdx]
  );

  // Group data if groupByField is set (use filtered data)
  const groupedData = useMemo(() => {
    if (!groupByField) return null;

    const groups: Record<string, any[]> = {};
    filteredData.forEach(row => {
      const groupValue = row[groupByField] ?? '(empty)';
      const groupKey = String(groupValue);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
    });

    return groups;
  }, [filteredData, groupByField]);

  const toggleField = (field: string) => {
    setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleAllFields = (visible: boolean) => {
    setVisibleFields(
      allColumns.reduce((acc, col) => ({ ...acc, [col]: visible }), {})
    );
  };

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Filter management functions
  const updateFilter = (fieldName: string, type: FilterCondition['type'], value: any) => {
    setFilters(prev => ({
      ...prev,
      [fieldName]: { field: fieldName, type, value }
    }));
  };

  const removeFilter = (fieldName: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[fieldName];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const activeFilterCount = Object.keys(filters).length;

  if (dataArray.length === 0) {
    return <div className="text-center text-base-content/60 py-8">無法以表格形式展示此數據</div>;
  }

  // Render filter control for a specific field
  const renderFilterControl = (fieldName: string) => {
    const fieldInfo = fieldsInfo.get(fieldName);
    if (!fieldInfo) return null;

    const currentFilter = filters[fieldName];

    switch (fieldInfo.type) {
      case 'number':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={`最小值 (${fieldInfo.min ?? ''})`}
                className="input input-xs input-bordered flex-1"
                value={currentFilter?.value?.min ?? ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  updateFilter(fieldName, 'number', {
                    min: newValue === '' ? undefined : parseFloat(newValue),
                    max: currentFilter?.value?.max
                  });
                }}
              />
              <span>-</span>
              <input
                type="number"
                placeholder={`最大值 (${fieldInfo.max ?? ''})`}
                className="input input-xs input-bordered flex-1"
                value={currentFilter?.value?.max ?? ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  updateFilter(fieldName, 'number', {
                    min: currentFilter?.value?.min,
                    max: newValue === '' ? undefined : parseFloat(newValue)
                  });
                }}
              />
            </div>
            <div className="text-xs text-base-content/60">
              範圍: {fieldInfo.min} ~ {fieldInfo.max}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <select
            className="select select-xs select-bordered w-full"
            value={currentFilter?.value ?? 'all'}
            onChange={(e) => updateFilter(fieldName, 'boolean', e.target.value)}
          >
            <option value="all">全部</option>
            <option value="true">是 (true)</option>
            <option value="false">否 (false)</option>
          </select>
        );

      case 'string':
      case 'date':
      default:
        return (
          <input
            type="text"
            placeholder="輸入搜索關鍵字..."
            className="input input-xs input-bordered w-full"
            value={currentFilter?.value ?? ''}
            onChange={(e) => updateFilter(fieldName, 'text', e.target.value)}
          />
        );
    }
  };

  const renderTableHeader = () => (
    <thead>
      <tr>
        {visibleColumns.map(col => (
          <th key={col} className="bg-base-300 text-left px-4 py-2 whitespace-nowrap">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderTableRow = (row: Record<string, any>, index: number) => (
    <tr key={index} className="hover:bg-base-300/50">
      {visibleColumns.map(col => (
        <td key={col} className="px-4 py-2 border-t border-base-300">
          {row[col] !== undefined && row[col] !== null ? String(row[col]) : '-'}
        </td>
      ))}
    </tr>
  );

  const renderGroupedTable = () => {
    if (!groupedData) return null;

    return (
      <div className="space-y-2">
        {Object.entries(groupedData).map(([groupKey, rows]) => {
          const isExpanded = expandedGroups[groupKey] ?? true;

          return (
            <div key={groupKey} className="border border-base-300 rounded-lg overflow-hidden">
              {/* Group Header */}
              <div
                className="bg-primary text-primary-content px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-primary-focus"
                onClick={() => toggleGroup(groupKey)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                  <span className="font-semibold">{groupByField}: {groupKey}</span>
                </div>
                <span className="badge badge-sm">{rows.length} 項</span>
              </div>

              {/* Group Content */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="table table-xs w-full">
                    {renderTableHeader()}
                    <tbody>
                      {rows.map((row, idx) => renderTableRow(row, idx))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const visibleCount = visibleColumns.length;
  const totalCount = allColumns.length;

  return (
    <div className="space-y-4">
      {/* Filter Panel Toggle Button */}
      <div className="flex justify-between items-center">
        <button
          className="btn btn-sm btn-outline gap-2"
          onClick={() => setShowFilterPanel(!showFilterPanel)}
        >
          <FiFilter />
          篩選
          {activeFilterCount > 0 && (
            <span className="badge badge-primary badge-sm">{activeFilterCount}</span>
          )}
        </button>
        {activeFilterCount > 0 && (
          <button
            className="btn btn-sm btn-ghost gap-2"
            onClick={clearAllFilters}
          >
            <FiX />
            清除所有篩選
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">數據篩選</h3>
              <span className="text-sm text-base-content/60">
                {filteredData.length} / {flattenedData.length} 筆記錄
              </span>
            </div>

            {/* Filter Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allColumns.map(fieldName => {
                const fieldInfo = fieldsInfo.get(fieldName);
                if (!fieldInfo) return null;

                const hasFilter = !!filters[fieldName];

                return (
                  <div
                    key={fieldName}
                    className={`p-3 rounded-lg border ${
                      hasFilter
                        ? 'bg-primary/10 border-primary'
                        : 'bg-base-100 border-base-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm flex items-center gap-2">
                          {fieldName}
                          {hasFilter && (
                            <button
                              className="btn btn-xs btn-circle btn-ghost"
                              onClick={() => removeFilter(fieldName)}
                              title="移除篩選"
                            >
                              <FiX />
                            </button>
                          )}
                        </div>
                        <div className="text-xs text-base-content/60 mt-1 flex gap-2">
                          <span className="badge badge-xs">{fieldInfo.type}</span>
                          <span>{fieldInfo.uniqueCount} 個唯一值</span>
                        </div>
                      </div>
                    </div>
                    {renderFilterControl(fieldName)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && !showFilterPanel && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([fieldName, filter]) => {
            let displayValue = '';
            if (filter.type === 'number' && filter.value) {
              const { min, max } = filter.value;
              if (min !== undefined && max !== undefined) {
                displayValue = `${min} ~ ${max}`;
              } else if (min !== undefined) {
                displayValue = `≥ ${min}`;
              } else if (max !== undefined) {
                displayValue = `≤ ${max}`;
              }
            } else if (filter.type === 'boolean') {
              displayValue = filter.value === 'true' ? '是' : '否';
            } else {
              displayValue = String(filter.value);
            }

            return (
              <div key={fieldName} className="badge badge-primary gap-2">
                <span className="font-medium">{fieldName}:</span>
                <span>{displayValue}</span>
                <button
                  className="btn btn-xs btn-circle btn-ghost"
                  onClick={() => removeFilter(fieldName)}
                >
                  <FiX size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Field Control Panel */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">字段控制</span>
            <span className="badge badge-sm">{visibleCount}/{totalCount}</span>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => toggleAllFields(true)}
            >
              全選
            </button>
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => toggleAllFields(false)}
            >
              全不選
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 p-3 bg-base-300 rounded-lg max-h-32 overflow-y-auto">
          {allColumns.map(col => (
            <label key={col} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary"
                checked={visibleFields[col] || false}
                onChange={() => toggleField(col)}
              />
              <span className="text-sm">{col}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Group By Control */}
      <div className="flex items-center gap-3">
        <label className="font-semibold text-sm">分組依據:</label>
        <select
          className="select select-sm select-bordered"
          value={groupByField}
          onChange={(e) => setGroupByField(e.target.value)}
        >
          <option value="">不分組</option>
          {allColumns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
        {groupByField && (
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => setGroupByField('')}
          >
            清除分組
          </button>
        )}
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto border border-base-300 rounded-lg">
        {groupByField ? (
          renderGroupedTable()
        ) : (
          <table className="table table-xs w-full">
            {renderTableHeader()}
            <tbody>
              {paginatedData.map((row, idx) => renderTableRow(row, startIdx + idx))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!groupByField && filteredData.length > pageSize && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-sm text-base-content/60">
            顯示第 {startIdx + 1} - {Math.min(endIdx, filteredData.length)} 行，共 {filteredData.length} 行
            {activeFilterCount > 0 && (
              <span className="ml-2 text-primary">(已篩選，總計 {flattenedData.length} 行)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              className="select select-xs select-bordered"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={25}>25 行/頁</option>
              <option value={50}>50 行/頁</option>
              <option value={100}>100 行/頁</option>
              <option value={200}>200 行/頁</option>
            </select>

            <div className="join">
              <button
                className="join-item btn btn-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                首頁
              </button>
              <button
                className="join-item btn btn-xs"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                上一頁
              </button>
              <button className="join-item btn btn-xs btn-disabled">
                {currentPage} / {totalPages}
              </button>
              <button
                className="join-item btn btn-xs"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                下一頁
              </button>
              <button
                className="join-item btn btn-xs"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                末頁
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Info */}
      <div className="text-sm text-base-content/60 text-right">
        {groupByField ? (
          <>
            顯示 {filteredData.length} 行 × {visibleCount} 列（已分組）
            {activeFilterCount > 0 && ` - 已套用 ${activeFilterCount} 個篩選`}
          </>
        ) : (
          <>
            總計 {filteredData.length} 行 × {visibleCount} 列
            {activeFilterCount > 0 && (
              <span className="text-primary ml-2">
                (已篩選自 {flattenedData.length} 行)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
