# 模块复用指南

本文档说明如何将此文件上传与数据预览功能模块引入到其他 Flowbite 项目中。

## 📦 方案一：NPM 本地包（推荐）

### 优点
- 版本控制清晰
- 依赖管理自动化
- 可以发布到私有 npm registry
- 最专业的解决方案

### 实施步骤

#### 1. 创建独立的 npm 包

在当前项目创建一个子目录：

```bash
mkdir packages
cd packages
mkdir upload-data-module
cd upload-data-module
npm init -y
```

#### 2. 组织包结构

```
packages/upload-data-module/
├── package.json
├── README.md
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── JsonInput.tsx
│   │   ├── DataPreview.tsx
│   │   └── HistoryPanel.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── lib/
│   │   └── storage.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts (导出所有组件)
├── tsconfig.json
└── tailwind.config.js
```

#### 3. 配置 package.json

```json
{
  "name": "@yourorg/upload-data-module",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next": "^14.0.0",
    "flowbite": "^2.0.0",
    "flowbite-react": "^0.10.0",
    "react-icons": "^5.0.0"
  }
}
```

#### 4. 在其他项目中使用

```bash
# 本地安装
npm install ../path/to/packages/upload-data-module

# 或发布到 npm 后
npm install @yourorg/upload-data-module
```

```tsx
// 在其他项目中使用
import {
  FileUpload,
  JsonInput,
  DataPreview,
  HistoryPanel,
  ThemeProvider
} from '@yourorg/upload-data-module';
```

---

## 📋 方案二：复制核心文件（快速方案）

### 优点
- 实施快速
- 可以自由修改
- 无需额外配置

### 需要复制的文件清单

#### 核心组件 (必需)
```
components/
├── FileUpload.tsx
├── JsonInput.tsx
├── DataPreview.tsx
└── HistoryPanel.tsx
```

#### 上下文管理 (如需主题切换)
```
contexts/
└── ThemeContext.tsx

components/
└── ThemeToggle.tsx
```

#### 工具函数 (必需)
```
lib/
└── storage.ts
```

#### 样式配置 (需要检查)
```
app/globals.css (部分样式)
tailwind.config.ts (Flowbite 配置)
```

### 实施步骤

1. **创建目标目录**
```bash
cd /path/to/your-flowbite-project
mkdir -p components lib contexts
```

2. **复制文件**
```bash
# 从当前项目复制
cp -r /path/to/upload-file-dp2/components/*.tsx ./components/
cp -r /path/to/upload-file-dp2/lib/*.ts ./lib/
cp -r /path/to/upload-file-dp2/contexts/*.tsx ./contexts/
```

3. **安装依赖**
```bash
npm install react-icons
```

4. **检查 Tailwind 配置**
确保目标项目的 `tailwind.config.ts` 包含：
```typescript
import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  plugins: [
    flowbite.plugin(),
  ],
};
```

5. **在页面中使用**
```tsx
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
// ... 等等
```

---

## 🔧 方案三：Git Submodule

### 优点
- 保持代码同步
- 可以跨项目共享更新
- 版本控制集成

### 实施步骤

#### 1. 在原项目中创建可复用模块目录

```bash
cd /path/to/upload-file-dp2
mkdir -p shared-modules/upload-data-module
```

#### 2. 移动核心文件

```bash
mv components shared-modules/upload-data-module/
mv lib shared-modules/upload-data-module/
mv contexts shared-modules/upload-data-module/
```

#### 3. 创建独立的 Git 仓库

```bash
cd shared-modules/upload-data-module
git init
git add .
git commit -m "Initial commit: Upload data module"
# 推送到远程仓库
git remote add origin <your-repo-url>
git push -u origin main
```

#### 4. 在其他项目中添加为 submodule

```bash
cd /path/to/your-flowbite-project
git submodule add <your-repo-url> shared-modules/upload-data-module
git submodule init
git submodule update
```

#### 5. 使用模块

在 `tsconfig.json` 中添加路径映射：
```json
{
  "compilerOptions": {
    "paths": {
      "@shared/*": ["./shared-modules/upload-data-module/*"]
    }
  }
}
```

```tsx
import { FileUpload } from '@shared/components/FileUpload';
```

---

## 🎨 方案四：创建 Monorepo（大型项目）

### 优点
- 统一管理多个项目
- 共享依赖和配置
- 适合团队协作

### 使用工具
- **Turborepo** (推荐)
- **Nx**
- **Lerna**

### Turborepo 示例结构

```
my-workspace/
├── apps/
│   ├── project-a/          # 使用模块的项目 A
│   └── project-b/          # 使用模块的项目 B
├── packages/
│   └── upload-data-module/ # 共享的模块
├── package.json
└── turbo.json
```

### 实施步骤

```bash
npx create-turbo@latest
cd my-workspace
# 将现有项目移入 apps/
# 创建共享包在 packages/
```

---

## 📝 方案对比表

| 方案 | 难度 | 维护性 | 适用场景 | 推荐度 |
|------|------|--------|----------|--------|
| NPM 本地包 | 中 | 高 | 多项目复用 | ⭐⭐⭐⭐⭐ |
| 复制文件 | 低 | 低 | 快速原型 | ⭐⭐⭐ |
| Git Submodule | 中 | 中 | 跨项目同步 | ⭐⭐⭐⭐ |
| Monorepo | 高 | 高 | 企业级应用 | ⭐⭐⭐⭐⭐ |

---

## 🚀 快速开始清单

### 最小依赖清单

如果你只想复制核心功能，最少需要：

**文件**：
- [ ] `components/FileUpload.tsx`
- [ ] `components/JsonInput.tsx`
- [ ] `components/DataPreview.tsx`
- [ ] `components/HistoryPanel.tsx`
- [ ] `lib/storage.ts`

**NPM 包**：
- [ ] `react-icons`
- [ ] `flowbite` (已有)
- [ ] `flowbite-react` (已有)

**配置**：
- [ ] Tailwind 配置包含 Flowbite

### 可选功能

**主题切换**：
- [ ] `contexts/ThemeContext.tsx`
- [ ] `components/ThemeToggle.tsx`
- [ ] 更新 `app/layout.tsx` 包含 ThemeProvider

---

## 💡 最佳实践建议

### 1. 使用 TypeScript 接口

创建统一的类型定义：

```typescript
// types/upload-data.ts
export interface JsonData {
  [key: string]: any;
}

export interface UploadHistory {
  id: string;
  name: string;
  data: JsonData;
  timestamp: number;
  size: number;
}

export interface FilterConfig {
  field: string;
  type: 'string' | 'number' | 'boolean';
  value: any;
}
```

### 2. 配置文件化

将常量提取到配置文件：

```typescript
// config/upload-data.config.ts
export const UPLOAD_DATA_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['.json'],
  maxHistoryItems: 10,
  localStorageKeys: {
    history: 'uploadHistory',
    visibleFields: 'dataPreview_visibleFields',
  },
};
```

### 3. 环境变量

使用环境变量控制行为：

```env
# .env.local
NEXT_PUBLIC_MAX_UPLOAD_SIZE=5242880
NEXT_PUBLIC_MAX_HISTORY_ITEMS=10
```

### 4. 文档化

为每个组件添加 JSDoc 注释：

```typescript
/**
 * FileUpload Component
 *
 * @param onUpload - Callback function when file is successfully uploaded
 * @param maxSize - Maximum file size in bytes (default: 5MB)
 * @param accept - Accepted file types (default: .json)
 *
 * @example
 * ```tsx
 * <FileUpload
 *   onUpload={(data) => console.log(data)}
 *   maxSize={10485760}
 * />
 * ```
 */
```

---

## 🔄 迁移步骤示例

假设你要将此功能引入到 `/path/to/new-flowbite-project`：

```bash
# 1. 进入新项目
cd /path/to/new-flowbite-project

# 2. 创建目录
mkdir -p components/upload-data
mkdir -p lib/upload-data
mkdir -p contexts

# 3. 复制文件
cp /path/to/upload-file-dp2/components/{FileUpload,JsonInput,DataPreview,HistoryPanel}.tsx \
   ./components/upload-data/

cp /path/to/upload-file-dp2/lib/storage.ts \
   ./lib/upload-data/

cp /path/to/upload-file-dp2/contexts/ThemeContext.tsx \
   ./contexts/

# 4. 安装依赖
npm install react-icons

# 5. 在页面中导入使用
```

在你的页面中：

```tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/upload-data/FileUpload';
import { JsonInput } from '@/components/upload-data/JsonInput';
import { DataPreview } from '@/components/upload-data/DataPreview';

export default function MyPage() {
  const [jsonData, setJsonData] = useState<any>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">数据导入</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FileUpload onUpload={setJsonData} />
        <JsonInput onJsonParsed={setJsonData} />
      </div>

      {jsonData && (
        <div className="mt-8">
          <DataPreview data={jsonData} />
        </div>
      )}
    </div>
  );
}
```

---

## 📚 延伸阅读

- [创建可复用的 React 组件库](https://react.dev/learn/sharing-state-between-components)
- [Turborepo 文档](https://turbo.build/repo/docs)
- [发布 NPM 包指南](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
- [Git Submodules 使用](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

---

## 🤝 需要帮助？

如果在迁移过程中遇到问题，可以参考：
1. 本项目的 README.md
2. THEME_GUIDE.md (主题相关)
3. IMPLEMENTATION_SUMMARY.md (技术细节)
