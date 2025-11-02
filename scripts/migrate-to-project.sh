#!/bin/bash

# 快速迁移脚本
# 用于将模块快速迁移到另一个 Flowbite 项目

set -e

# 使用方法
usage() {
    echo "使用方法: ./migrate-to-project.sh <target-project-path>"
    echo ""
    echo "示例:"
    echo "  ./migrate-to-project.sh /path/to/my-flowbite-project"
    echo ""
    exit 1
}

# 检查参数
if [ -z "$1" ]; then
    echo "❌ 错误: 请提供目标项目路径"
    usage
fi

TARGET_PROJECT="$1"

# 检查目标项目是否存在
if [ ! -d "$TARGET_PROJECT" ]; then
    echo "❌ 错误: 目标项目不存在: $TARGET_PROJECT"
    exit 1
fi

echo "🚀 开始迁移上传数据模块..."
echo "📍 目标项目: $TARGET_PROJECT"
echo ""

# 创建目录
echo "📁 创建目录结构..."
mkdir -p "$TARGET_PROJECT/components/upload-data"
mkdir -p "$TARGET_PROJECT/lib/upload-data"
mkdir -p "$TARGET_PROJECT/contexts"

# 复制组件
echo "📋 复制组件..."
cp components/FileUpload.tsx "$TARGET_PROJECT/components/upload-data/"
cp components/JsonInput.tsx "$TARGET_PROJECT/components/upload-data/"
cp components/DataPreview.tsx "$TARGET_PROJECT/components/upload-data/"
cp components/HistoryPanel.tsx "$TARGET_PROJECT/components/upload-data/"
echo "  ✓ FileUpload.tsx"
echo "  ✓ JsonInput.tsx"
echo "  ✓ DataPreview.tsx"
echo "  ✓ HistoryPanel.tsx"

# 复制工具库
echo "📋 复制工具库..."
cp lib/storage.ts "$TARGET_PROJECT/lib/upload-data/"
echo "  ✓ storage.ts"

# 询问是否复制主题相关文件
echo ""
read -p "❓ 是否需要主题切换功能? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📋 复制主题相关文件..."
    cp contexts/ThemeContext.tsx "$TARGET_PROJECT/contexts/"
    cp components/ThemeToggle.tsx "$TARGET_PROJECT/components/upload-data/"
    echo "  ✓ ThemeContext.tsx"
    echo "  ✓ ThemeToggle.tsx"
fi

# 复制示例数据
echo ""
read -p "❓ 是否复制示例数据? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📋 复制示例数据..."
    mkdir -p "$TARGET_PROJECT/public"
    cp public/sample-data.json "$TARGET_PROJECT/public/" 2>/dev/null || true
    cp public/sample-data-employees.json "$TARGET_PROJECT/public/" 2>/dev/null || true
    echo "  ✓ 示例数据已复制"
fi

# 检查依赖
echo ""
echo "📦 检查依赖..."
cd "$TARGET_PROJECT"

# 检查 package.json 是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 目标项目没有 package.json"
    exit 1
fi

# 检查并安装依赖
MISSING_DEPS=()

if ! grep -q "react-icons" package.json; then
    MISSING_DEPS+=("react-icons")
fi

if ! grep -q "flowbite-react" package.json; then
    MISSING_DEPS+=("flowbite-react")
fi

if ! grep -q "flowbite" package.json; then
    MISSING_DEPS+=("flowbite")
fi

if [ ${#MISSING_DEPS[@]} -gt 0 ]; then
    echo "⚠️  需要安装以下依赖:"
    for dep in "${MISSING_DEPS[@]}"; do
        echo "  - $dep"
    done
    echo ""
    read -p "❓ 是否现在安装? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 安装依赖..."
        npm install "${MISSING_DEPS[@]}"
    else
        echo "⚠️  请手动运行: npm install ${MISSING_DEPS[*]}"
    fi
fi

# 创建使用示例
echo ""
echo "📝 创建使用示例..."
cat > "$TARGET_PROJECT/UPLOAD_MODULE_USAGE.md" << 'EOF'
# 上传数据模块使用指南

## 导入组件

```tsx
import { FileUpload } from '@/components/upload-data/FileUpload';
import { JsonInput } from '@/components/upload-data/JsonInput';
import { DataPreview } from '@/components/upload-data/DataPreview';
import { HistoryPanel } from '@/components/upload-data/HistoryPanel';

// 如果安装了主题功能
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/upload-data/ThemeToggle';
```

## 基本使用

```tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/upload-data/FileUpload';
import { DataPreview } from '@/components/upload-data/DataPreview';

export default function MyPage() {
  const [jsonData, setJsonData] = useState<any>(null);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">数据导入</h1>

      <FileUpload onUpload={setJsonData} />

      {jsonData && (
        <div className="mt-8">
          <DataPreview data={jsonData} />
        </div>
      )}
    </div>
  );
}
```

## 配置 Tailwind

确保你的 `tailwind.config.ts` 包含 Flowbite 配置:

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

## 使用主题功能 (可选)

在 `app/layout.tsx` 中:

```tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## 更多信息

查看原项目的文档:
- README.md
- THEME_GUIDE.md
- FILTER_FEATURES.md
EOF

cd - > /dev/null

echo ""
echo "✅ 迁移完成！"
echo ""
echo "📂 已复制的文件:"
echo "  - components/upload-data/ (4 个组件)"
echo "  - lib/upload-data/ (工具函数)"
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "  - contexts/ (主题上下文)"
fi
echo ""
echo "📖 使用指南已创建: $TARGET_PROJECT/UPLOAD_MODULE_USAGE.md"
echo ""
echo "🎯 接下来的步骤:"
echo "1. 检查 Tailwind 配置是否正确"
echo "2. 阅读 UPLOAD_MODULE_USAGE.md"
echo "3. 在你的页面中导入并使用组件"
echo ""
echo "💡 提示: 可以从示例数据开始测试功能"
echo ""
