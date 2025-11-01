# 主題切換功能使用指南

## 概述

本專案已成功整合 **Flowbite** 和 **DaisyUI** 雙主題系統，用戶可以在兩種設計風格之間自由切換。

## 功能特點

### 1. 主題切換
- **位置**：頁面右上角，存儲使用統計旁邊
- **按鈕**：顯示當前主題名稱（DaisyUI 或 Flowbite）
- **切換方式**：點擊按鈕即可在兩種主題之間切換
- **持久化**：主題選擇會自動保存到 localStorage，刷新頁面後保持

### 2. DaisyUI 主題
- **特點**：色彩豐富、組件化設計
- **風格**：現代、活潑
- **組件**：使用 DaisyUI 的預設組件類別（btn, card, badge 等）

### 3. Flowbite 主題
- **特點**：專業、簡潔
- **風格**：企業級、現代化
- **組件**：使用 Flowbite 的設計系統（基於 Tailwind 的語義化類別）
- **Dark Mode**：完整支援深色模式

## 技術實現

### 核心組件

1. **ThemeContext** (`/contexts/ThemeContext.tsx`)
   - 使用 React Context API 管理主題狀態
   - 提供 `theme`、`setTheme`、`toggleTheme` 方法
   - 自動保存主題到 localStorage

2. **ThemeToggle** (`/components/ThemeToggle.tsx`)
   - 主題切換按鈕組件
   - 根據當前主題動態調整樣式

3. **更新的組件**
   - `FileUpload`: 文件上傳組件
   - `JsonInput`: JSON 輸入組件
   - `DataPreview`: 數據預覽組件
   - `HistoryPanel`: 歷史記錄面板
   - `page.tsx`: 主頁面

### 樣式策略

每個組件都使用條件渲染來根據當前主題應用不同的樣式：

```typescript
const { theme } = useTheme();

// 根據主題選擇不同的 CSS 類別
const buttonClass = theme === 'flowbite'
  ? 'px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg'
  : 'btn btn-primary';
```

## 配置

### Tailwind 配置 (`tailwind.config.ts`)

```typescript
plugins: [
  require("daisyui"),
  require("flowbite/plugin"),
],
content: [
  // ... 其他路徑
  "./node_modules/flowbite/**/*.js",
  "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
],
```

## 使用方法

### 1. 訪問應用
打開瀏覽器訪問：http://localhost:3006

### 2. 切換主題
- 找到頁面右上角的主題切換按鈕
- 點擊按鈕在 DaisyUI 和 Flowbite 之間切換
- 觀察整個頁面的設計風格變化

### 3. 測試功能
在不同主題下測試所有功能：
- ✅ 文件上傳
- ✅ JSON 數據輸入和解析
- ✅ 數據預覽（樹狀、JSON、表格視圖）
- ✅ 數據保存和歷史記錄
- ✅ 模態框和提示訊息

## 主題對比

| 功能 | DaisyUI | Flowbite |
|------|---------|----------|
| 按鈕 | `btn btn-primary` | `bg-blue-600 rounded-lg` |
| 卡片 | `card bg-base-200` | `bg-white border rounded-lg` |
| 徽章 | `badge badge-primary` | `bg-blue-600 rounded-full` |
| 輸入框 | `input input-bordered` | `border rounded-lg focus:ring` |
| 模態框 | `modal modal-open` | `fixed inset-0 z-50` |
| 提示訊息 | `alert alert-success` | `bg-green-50 rounded-lg` |

## 優勢

### DaisyUI 主題
- ✨ 快速開發：預設組件類別簡潔
- 🎨 豐富主題：內建多種顏色主題
- 📦 輕量級：CSS 大小較小

### Flowbite 主題
- 💼 專業感：企業級設計風格
- 🌙 深色模式：完整的 dark mode 支援
- 🎯 精細控制：基於 Tailwind utilities
- 📱 響應式：優秀的移動端體驗

## 開發建議

### 添加新組件時
1. 引入 `useTheme` hook
2. 為兩種主題分別設計樣式
3. 使用條件渲染切換樣式
4. 測試兩種主題下的顯示效果

### 示例代碼

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export default function MyComponent() {
  const { theme } = useTheme();

  return (
    <div className={
      theme === 'flowbite'
        ? 'bg-white dark:bg-gray-800 rounded-lg border'
        : 'card bg-base-200'
    }>
      <h2 className={
        theme === 'flowbite'
          ? 'text-gray-900 dark:text-white font-bold'
          : 'card-title'
      }>
        標題
      </h2>
    </div>
  );
}
```

## 未來改進

- [ ] 添加更多 DaisyUI 內建主題（cupcake, cyberpunk 等）
- [ ] 實現 Flowbite 主題的自定義顏色配置
- [ ] 添加主題預覽功能
- [ ] 支援更多組件的主題切換
- [ ] 添加主題切換動畫效果

## 相關資源

- [DaisyUI 文檔](https://daisyui.com/)
- [Flowbite 文檔](https://flowbite.com/)
- [Flowbite React](https://flowbite-react.com/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)

---

**專案狀態**: ✅ 完成
**測試狀態**: 🧪 建議測試所有功能
**瀏覽器支援**: Chrome, Firefox, Safari, Edge (最新版本)
