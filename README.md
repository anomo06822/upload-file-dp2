# 文件上傳與 JSON 數據管理系統

一個基於 Next.js 的現代化文件上傳和 JSON 數據管理應用，支持文件拖拽上傳、JSON 數據導入、數據預覽和本地存儲功能。

## 功能特點

### 核心功能

1. **文件上傳**
   - 支持拖拽上傳和點擊選擇文件
   - 文件類型驗證（僅接受 JSON 格式）
   - 文件大小限制（默認 5MB）
   - 實時文件信息顯示

2. **JSON 數據輸入**
   - 文件上傳模式：直接上傳 JSON 文件
   - 文本輸入模式：手動粘貼或輸入 JSON 數據
   - 實時 JSON 格式驗證
   - JSON 格式化功能
   - 清晰的錯誤提示

3. **數據預覽**
   - 樹狀視圖：可展開/收起的層級結構顯示
   - JSON 視圖：格式化的 JSON 文本顯示
   - **表格視圖**：強大的數據表格展示（新增！）
   - 數據統計信息（類型、項目數量、大小）
   - 一鍵複製 JSON 數據

4. **表格視圖功能** ⭐ 新增
   - **智能字段分析**：自動識別字段類型（string, number, boolean, date）
   - **動態數據篩選**：
     - 文字欄位：模糊搜索
     - 數字欄位：範圍篩選（最小值/最大值）
     - 布林欄位：true/false 選擇
   - **靈活分組**：按任意字段分組查看數據
   - **字段控制**：顯示/隱藏欄位，持久化設置
   - **分頁功能**：高效處理大量數據
   - **響應式設計**：完美適配各種螢幕尺寸

5. **數據存儲**
   - 保存到瀏覽器 localStorage
   - 自定義數據命名
   - 存儲空間使用情況顯示
   - 支持數據導出為 JSON 文件

6. **歷史記錄**
   - 保留最近 10 筆上傳記錄
   - 查看歷史數據
   - 重新加載歷史數據
   - 刪除單筆或全部歷史記錄
   - 導出歷史數據為文件

## 技術架構

### 前端框架
- **Next.js 14** - React 全端框架
- **React 18** - UI 組件庫
- **TypeScript** - 類型安全

### 樣式設計
- **Tailwind CSS** - Utility-first CSS 框架
- **DaisyUI** - Tailwind CSS 組件庫
- **React Icons** - 圖標庫

### 數據存儲
- **localStorage** - 瀏覽器本地存儲
- 自定義存儲管理服務

## 項目結構

```
upload-file-dp2/
├── app/
│   ├── globals.css          # 全局樣式
│   ├── layout.tsx           # 根佈局
│   └── page.tsx             # 主頁面
├── components/
│   ├── DataPreview.tsx      # 數據預覽組件
│   ├── FileUpload.tsx       # 文件上傳組件
│   ├── HistoryPanel.tsx     # 歷史記錄組件
│   └── JsonInput.tsx        # JSON 輸入組件
├── lib/
│   └── storage.ts           # localStorage 管理服務
├── public/
│   └── sample-data.json     # 範例數據文件
├── next.config.mjs          # Next.js 配置
├── tailwind.config.ts       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 項目依賴
```

## 快速開始

### 環境要求

- Node.js 18.x 或更高版本
- npm 或 yarn 或 pnpm

### 安裝步驟

1. **安裝依賴**

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

2. **啟動開發服務器**

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

3. **訪問應用**

在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

### 構建生產版本

```bash
npm run build
npm run start
```

## 使用指南

### 步驟 1: 輸入數據

選擇以下任一方式輸入數據：

**方式 A: 文件上傳**
1. 點擊「文件上傳」標籤
2. 拖拽 JSON 文件到上傳區域，或點擊「選擇文件」按鈕
3. 系統自動解析並顯示文件內容

**方式 B: 直接輸入**
1. 點擊「直接輸入」標籤
2. 在文本框中粘貼或輸入 JSON 數據
3. 點擊「解析 JSON」驗證格式
4. 可使用「格式化」功能美化 JSON

### 步驟 2: 預覽數據

成功解析後，系統會顯示數據預覽：

- **切換視圖**：在樹狀視圖、JSON 視圖和表格視圖之間切換
- **查看統計**：數據類型、項目數量、文件大小
- **複製數據**：點擊複製圖標快速複製 JSON

### 步驟 2.1: 使用表格視圖（進階功能）⭐

切換到表格視圖後，可使用強大的數據分析功能：

**篩選數據**
1. 點擊「篩選」按鈕開啟篩選面板
2. 根據字段類型設置篩選條件：
   - 文字欄位：輸入關鍵字進行模糊搜索
   - 數字欄位：設置最小值和最大值範圍
   - 布林欄位：選擇 true/false
3. 可同時設置多個篩選條件
4. 點擊徽章上的 X 移除單一篩選，或點擊「清除所有篩選」

**分組查看**
1. 在「分組依據」下拉選單選擇字段
2. 數據會按選定字段自動分組
3. 點擊分組標題展開/收起內容
4. 分組會自動應用當前的篩選條件

**字段控制**
1. 使用字段控制面板顯示/隱藏特定欄位
2. 點擊「全選」或「全不選」快速操作
3. 設置會自動保存到 localStorage

**實用場景示例**
- 篩選年齡在 25-30 之間的員工
- 查找技術部的活躍員工
- 按城市分組查看員工分布
- 找出薪資超過 60000 的員工

### 步驟 3: 保存數據

1. 點擊「確認保存數據」按鈕
2. 在彈出框中輸入數據名稱（可選）
3. 點擊「確認保存」完成保存
4. 數據將被保存到瀏覽器 localStorage

### 管理歷史記錄

右側面板顯示歷史記錄，支持：

- **預覽**：點擊眼睛圖標重新加載數據
- **下載**：點擊下載圖標導出為 JSON 文件
- **刪除**：點擊刪除圖標移除單筆記錄
- **清空**：點擊「清除全部」移除所有記錄

## 範例數據

項目包含多個範例數據文件供測試：

### 1. 基礎範例 (`public/sample-data.json`)
基本的用戶數據結構

### 2. 員工數據範例 (`public/sample-data-employees.json`) ⭐ 推薦
包含 12 筆員工記錄，適合測試表格視圖的篩選和分組功能：

```json
[
  {
    "id": 1,
    "name": "張三",
    "age": 25,
    "salary": 50000,
    "department": "技術部",
    "active": true,
    "city": "台北",
    "joinDate": "2023-01-15"
  },
  ...
]
```

**測試建議**：
- 嘗試按 `city` 分組查看地理分布
- 篩選 `salary` 範圍查找高薪員工
- 組合 `department` 和 `active` 篩選
- 使用 `age` 範圍篩選特定年齡段

## 詳細文檔

專案包含詳細的功能說明文檔：

- **[QUICK_START.md](./QUICK_START.md)** - 快速開始指南
- **[FILTER_FEATURES.md](./FILTER_FEATURES.md)** - 篩選功能詳細說明
- **[FEATURES_DEMO.md](./FEATURES_DEMO.md)** - 功能展示與演示案例
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - 技術實現總結

## 功能限制

- 文件大小限制：5MB（可在 FileUpload 組件中調整）
- 歷史記錄數量：最多保留 10 筆（可在 storage.ts 中調整）
- localStorage 容量：約 5-10MB（因瀏覽器而異）
- 僅支持 JSON 格式文件

## 瀏覽器支持

- Chrome（推薦）
- Firefox
- Safari
- Edge

需要支持 localStorage 和 ES6+ 特性的現代瀏覽器。

## 開發說明

### 主要組件

**FileUpload.tsx**
- 處理文件拖拽和選擇
- 文件驗證和錯誤處理

**JsonInput.tsx**
- 雙模式輸入（文件/文本）
- JSON 解析和驗證
- 格式化功能

**DataPreview.tsx**
- 樹狀、JSON 和表格三視圖
- 智能字段分析系統
- 動態數據篩選功能
- 靈活分組功能
- 數據統計
- 複製功能

**HistoryPanel.tsx**
- 歷史記錄管理
- 數據重載和導出

### Storage Service (lib/storage.ts)

提供完整的 localStorage 管理功能：

- `saveData()` - 保存數據
- `loadData()` - 加載當前數據
- `getHistory()` - 獲取歷史記錄
- `exportData()` - 導出為文件
- `getStorageInfo()` - 獲取存儲信息

## 自定義配置

### 修改文件大小限制

編輯 `components/FileUpload.tsx`：

```typescript
<FileUpload
  onFileSelect={handleFileSelect}
  maxSize={10 * 1024 * 1024} // 改為 10MB
/>
```

### 修改歷史記錄數量

編輯 `lib/storage.ts`：

```typescript
// 將 10 改為你想要的數量
const limitedHistory = history.slice(0, 20);
```

### 切換 DaisyUI 主題

編輯 `tailwind.config.ts`：

```typescript
daisyui: {
  themes: ["light", "dark", "cupcake", "cyberpunk"],
  darkTheme: "dark", // 修改默認暗色主題
}
```

## 常見問題

**Q: 數據保存在哪裡？**
A: 數據保存在瀏覽器的 localStorage 中，僅存在於本地，不會上傳到服務器。

**Q: 清除瀏覽器數據會影響保存的內容嗎？**
A: 是的，清除瀏覽器數據會刪除所有保存在 localStorage 中的數據。建議定期導出重要數據。

**Q: 支持其他文件格式嗎？**
A: 目前僅支持 JSON 格式。如需支持其他格式，需要修改 FileUpload 組件的驗證邏輯。

**Q: 可以同時保存多個數據集嗎？**
A: 可以，歷史記錄會保存最近 10 筆數據，每筆都可以單獨查看和導出。

## 許可證

MIT License

## 作者

Built with Next.js, Tailwind CSS & DaisyUI

---

如有問題或建議，歡迎提出 Issue。
