# 快速迁移指南 🚀

如果你想在另一个 Flowbite 项目中使用这个模块，这里是最快的方法。

## ⚡ 方法一：使用自动化脚本（推荐）

### 快速迁移到现有项目

```bash
# 在当前项目根目录执行
./scripts/migrate-to-project.sh /path/to/your-flowbite-project
```

这个脚本会自动：
- ✅ 复制所有必要的组件
- ✅ 复制工具函数
- ✅ 询问是否需要主题功能
- ✅ 检查并提示安装依赖
- ✅ 创建使用指南

---

## 📦 方法二：导出为 NPM 包

### 创建独立的 npm 包

```bash
# 在当前项目根目录执行
./scripts/export-module.sh
```

这会创建 `packages/upload-data-module/` 包含完整的模块。

### 在其他项目中安装

```bash
# 本地安装
npm install /path/to/upload-file-dp2/packages/upload-data-module

# 在代码中使用
import { FileUpload, DataPreview } from '@yourorg/upload-data-module';
```

---

## 🔧 方法三：手动复制（最快但需手动管理）

### 1. 复制核心文件

```bash
# 进入你的目标项目
cd /path/to/your-project

# 创建目录
mkdir -p components/upload-data lib/upload-data contexts

# 从源项目复制文件
cp /path/to/upload-file-dp2/components/{FileUpload,JsonInput,DataPreview,HistoryPanel}.tsx \
   ./components/upload-data/

cp /path/to/upload-file-dp2/lib/storage.ts ./lib/upload-data/

# 如果需要主题功能
cp /path/to/upload-file-dp2/contexts/ThemeContext.tsx ./contexts/
cp /path/to/upload-file-dp2/components/ThemeToggle.tsx ./components/upload-data/
```

### 2. 安装依赖

```bash
npm install react-icons
```

### 3. 配置 Tailwind (如果还没有)

确保 `tailwind.config.ts` 包含：

```typescript
import flowbite from "flowbite-react/tailwind";

const config = {
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

### 4. 使用组件

```tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/upload-data/FileUpload';
import { DataPreview } from '@/components/upload-data/DataPreview';

export default function MyPage() {
  const [data, setData] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <FileUpload onUpload={setData} />
      {data && <DataPreview data={data} />}
    </div>
  );
}
```

---

## 📋 必需文件清单

### 最小配置（只要上传和预览功能）

```
✅ components/FileUpload.tsx
✅ components/JsonInput.tsx
✅ components/DataPreview.tsx
✅ components/HistoryPanel.tsx
✅ lib/storage.ts
✅ npm install react-icons
```

### 完整配置（包含主题切换）

```
✅ 上面的所有文件 +
✅ contexts/ThemeContext.tsx
✅ components/ThemeToggle.tsx
```

---

## 🎯 快速测试

### 测试数据

```json
[
  {
    "id": 1,
    "name": "张三",
    "age": 25,
    "department": "技术部",
    "city": "台北"
  },
  {
    "id": 2,
    "name": "李四",
    "age": 30,
    "department": "业务部",
    "city": "台中"
  }
]
```

### 测试步骤

1. 在页面中添加 `<FileUpload>` 组件
2. 上传上面的 JSON 数据
3. 应该看到数据预览
4. 切换到表格视图
5. 测试筛选和分组功能

---

## ⚙️ Tailwind 配置参考

如果你的项目使用 DaisyUI + Flowbite，配置应该像这样：

```typescript
import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
    flowbite.plugin(),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};

export default config;
```

---

## 🆘 常见问题

### Q: 组件导入报错？

A: 确保路径正确，使用 `@/components/upload-data/...`

### Q: 样式不正常？

A: 检查 Tailwind 配置是否包含 Flowbite

### Q: localStorage 相关错误？

A: 确保组件使用了 `'use client'` 指令（Next.js 13+）

### Q: 主题切换不工作？

A: 确保在 `layout.tsx` 中包裹了 `<ThemeProvider>`

---

## 📚 更多信息

- 详细指南：`REUSABILITY_GUIDE.md`
- 主题文档：`THEME_GUIDE.md`
- 功能说明：`FILTER_FEATURES.md`
- 完整文档：`README.md`

---

## 💡 最佳实践

1. **版本控制**：如果多个项目使用，考虑创建 npm 包
2. **配置文件**：将常量提取到配置文件
3. **类型定义**：创建统一的 TypeScript 接口
4. **测试数据**：复制示例数据用于测试

---

## 🎉 完成！

现在你可以在任何 Flowbite/Next.js 项目中使用这些组件了！

如果遇到问题，查看完整的 `REUSABILITY_GUIDE.md` 获取更多帮助。
