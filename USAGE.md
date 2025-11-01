# 快速使用指南

## 啟動項目

### 1. 開發模式

```bash
npm run dev
```

然後在瀏覽器訪問：http://localhost:3000

### 2. 生產構建

```bash
npm run build
npm start
```

## 使用流程

### 方法 A：文件上傳

1. 準備一個 JSON 文件（可使用 `public/sample-data.json`）
2. 在「步驟 1: 輸入數據」區域，確保選中「文件上傳」標籤
3. 將文件拖拽到上傳區域，或點擊「選擇文件」按鈕
4. 系統會自動解析並驗證 JSON 格式
5. 如果格式正確，會顯示成功提示

### 方法 B：直接輸入 JSON

1. 點擊「直接輸入」標籤
2. 在文本框中粘貼或輸入 JSON 數據
3. 系統會自動驗證格式
4. 可點擊「格式化」按鈕美化 JSON
5. 點擊「解析 JSON」確認

### 預覽數據

成功解析後，「步驟 2: 預覽數據」會自動顯示：

- **樹狀視圖**：層級結構展示，可點擊展開/收起
- **JSON 視圖**：完整的 JSON 文本
- 統計信息：數據類型、項目數量、文件大小
- 複製功能：一鍵複製整個 JSON

### 保存數據

1. 點擊「確認保存數據」按鈕
2. 輸入數據名稱（可選，默認為 "Untitled"）
3. 點擊「確認保存」
4. 數據會保存到瀏覽器 localStorage

### 管理歷史記錄

右側「上傳歷史」面板提供：

- 查看最近 10 筆上傳記錄
- 點擊眼睛圖標重新加載數據
- 點擊下載圖標導出為 JSON 文件
- 點擊刪除圖標移除單筆記錄
- 點擊「清除全部」刪除所有歷史

### 其他功能

- **導出**：在主區域點擊「導出」按鈕可下載當前數據
- **重置**：點擊「重置」按鈕清除當前數據
- **存儲監控**：頂部顯示 localStorage 使用情況

## 範例數據

使用項目內建的範例數據：

```json
{
  "users": [
    {
      "id": 1,
      "name": "張三",
      "email": "zhangsan@example.com",
      "age": 28,
      "role": "開發者",
      "skills": ["JavaScript", "React", "Node.js"],
      "active": true
    },
    {
      "id": 2,
      "name": "李四",
      "email": "lisi@example.com",
      "age": 32,
      "role": "設計師",
      "skills": ["UI/UX", "Figma", "Photoshop"],
      "active": true
    }
  ],
  "metadata": {
    "version": "1.0",
    "created": "2024-01-01",
    "totalUsers": 2
  }
}
```

## 注意事項

1. **文件大小**：單個文件最大 5MB
2. **歷史記錄**：最多保留 10 筆
3. **存儲空間**：localStorage 總容量約 5-10MB
4. **數據安全**：所有數據僅存儲在本地瀏覽器，清除瀏覽器數據會丟失
5. **文件格式**：僅支持有效的 JSON 格式

## 常見操作

### 測試功能

1. 複製上面的範例 JSON
2. 點擊「直接輸入」標籤
3. 粘貼到文本框
4. 觀察自動驗證和格式化
5. 點擊「確認保存數據」
6. 查看歷史記錄面板

### 導入大型數據

1. 準備 JSON 文件（< 5MB）
2. 使用文件上傳功能
3. 等待解析完成
4. 在樹狀視圖中查看結構
5. 保存前確認數據正確

### 備份數據

1. 在歷史記錄中找到要備份的數據
2. 點擊下載圖標
3. 文件會自動下載到本地
4. 文件名格式：`數據名稱_日期.json`

## 開發相關

### 本地開發

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 代碼檢查
npm run lint

# 構建生產版本
npm run build
```

### 項目結構

```
├── app/              # Next.js App Router
│   ├── globals.css  # 全局樣式
│   ├── layout.tsx   # 根布局
│   └── page.tsx     # 首頁
├── components/       # React 組件
│   ├── DataPreview.tsx
│   ├── FileUpload.tsx
│   ├── HistoryPanel.tsx
│   └── JsonInput.tsx
├── lib/             # 工具函數
│   └── storage.ts   # localStorage 服務
└── public/          # 靜態資源
    └── sample-data.json
```

### 技術棧

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- DaisyUI
- React Icons

## 故障排除

### 問題：JSON 解析失敗

**解決方案**：
- 檢查 JSON 格式是否正確
- 使用在線 JSON 驗證工具
- 確保沒有多餘的逗號或引號
- 使用「格式化」功能檢查

### 問題：無法保存數據

**解決方案**：
- 檢查瀏覽器是否支持 localStorage
- 清理瀏覽器緩存和數據
- 確認沒有超出存儲限制
- 嘗試在無痕模式下運行

### 問題：歷史記錄不顯示

**解決方案**：
- 刷新頁面
- 檢查瀏覽器控制台是否有錯誤
- 清除並重新保存數據
- 檢查 localStorage 權限

### 問題：文件上傳失敗

**解決方案**：
- 確認文件是 .json 格式
- 檢查文件大小是否超過 5MB
- 驗證文件內容是有效的 JSON
- 嘗試使用直接輸入模式

## 進階使用

### 自定義配置

修改 `components/FileUpload.tsx` 調整上傳限制：

```typescript
maxSize={10 * 1024 * 1024} // 改為 10MB
```

修改 `lib/storage.ts` 調整歷史記錄數量：

```typescript
const limitedHistory = history.slice(0, 20); // 改為 20 筆
```

### 主題切換

Tailwind 和 DaisyUI 支持多種主題，可在配置中修改。

---

需要幫助？請查看 README.md 獲取更多信息。
