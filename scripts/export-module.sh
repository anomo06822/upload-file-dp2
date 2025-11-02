#!/bin/bash

# 模块导出脚本
# 用于将上传数据模块导出为独立的 npm 包

set -e

echo "🚀 开始导出上传数据模块..."

# 配置
MODULE_NAME="upload-data-module"
EXPORT_DIR="./packages/$MODULE_NAME"

# 创建目录结构
echo "📁 创建目录结构..."
mkdir -p "$EXPORT_DIR/src"/{components,lib,contexts,types}
mkdir -p "$EXPORT_DIR"

# 复制组件文件
echo "📋 复制组件文件..."
cp components/FileUpload.tsx "$EXPORT_DIR/src/components/"
cp components/JsonInput.tsx "$EXPORT_DIR/src/components/"
cp components/DataPreview.tsx "$EXPORT_DIR/src/components/"
cp components/HistoryPanel.tsx "$EXPORT_DIR/src/components/"
cp components/ThemeToggle.tsx "$EXPORT_DIR/src/components/"

# 复制工具文件
echo "📋 复制工具文件..."
cp lib/storage.ts "$EXPORT_DIR/src/lib/"

# 复制上下文
echo "📋 复制上下文文件..."
cp contexts/ThemeContext.tsx "$EXPORT_DIR/src/contexts/"

# 创建类型定义文件
echo "📝 创建类型定义..."
cat > "$EXPORT_DIR/src/types/index.ts" << 'EOF'
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

export interface FieldInfo {
  name: string;
  type: string;
  uniqueCount: number;
  min?: number;
  max?: number;
}

export type Theme = 'daisyui' | 'flowbite';
EOF

# 创建主导出文件
echo "📝 创建主导出文件..."
cat > "$EXPORT_DIR/src/index.ts" << 'EOF'
// Components
export { FileUpload } from './components/FileUpload';
export { JsonInput } from './components/JsonInput';
export { DataPreview } from './components/DataPreview';
export { HistoryPanel } from './components/HistoryPanel';
export { ThemeToggle } from './components/ThemeToggle';

// Contexts
export { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Utils
export {
  saveToHistory,
  getHistory,
  deleteHistoryItem,
  clearHistory,
  getStorageInfo,
  exportHistory,
} from './lib/storage';

// Types
export type {
  JsonData,
  UploadHistory,
  FilterConfig,
  FieldInfo,
  Theme,
} from './types';
EOF

# 创建 package.json
echo "📦 创建 package.json..."
cat > "$EXPORT_DIR/package.json" << 'EOF'
{
  "name": "@yourorg/upload-data-module",
  "version": "1.0.0",
  "description": "A reusable module for file upload and JSON data preview with filtering and grouping",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "scripts": {
    "build": "echo 'No build step required for development'",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "keywords": [
    "react",
    "nextjs",
    "upload",
    "json",
    "data-preview",
    "flowbite",
    "tailwind"
  ],
  "author": "",
  "license": "MIT",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next": "^14.0.0",
    "flowbite": "^2.0.0",
    "flowbite-react": "^0.10.0",
    "react-icons": "^5.0.0",
    "daisyui": "^4.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# 创建 README
echo "📖 创建 README..."
cat > "$EXPORT_DIR/README.md" << 'EOF'
# Upload Data Module

A reusable React/Next.js module for file upload and JSON data management with advanced preview, filtering, and grouping features.

## Features

- 📤 File upload with drag & drop
- 📝 JSON data import (file or direct input)
- 👁️ Multiple preview modes (Tree, JSON, Table)
- 🔍 Dynamic field filtering
- 📊 Group by any field
- 🎨 Dual theme support (DaisyUI & Flowbite)
- 💾 History management with localStorage

## Installation

```bash
npm install @yourorg/upload-data-module
```

## Quick Start

```tsx
import {
  FileUpload,
  JsonInput,
  DataPreview,
  ThemeProvider
} from '@yourorg/upload-data-module';

export default function MyPage() {
  const [data, setData] = useState(null);

  return (
    <ThemeProvider>
      <div>
        <FileUpload onUpload={setData} />
        <JsonInput onJsonParsed={setData} />
        {data && <DataPreview data={data} />}
      </div>
    </ThemeProvider>
  );
}
```

## Documentation

See the main project documentation for detailed usage instructions.

## License

MIT
EOF

# 创建 tsconfig.json
echo "⚙️ 创建 tsconfig.json..."
cat > "$EXPORT_DIR/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# 复制样式配置参考
echo "🎨 创建样式配置参考..."
cat > "$EXPORT_DIR/tailwind.config.example.js" << 'EOF'
// Add this to your project's tailwind.config.js

import flowbite from "flowbite-react/tailwind";

export default {
  content: [
    // ... your content
    "./node_modules/@yourorg/upload-data-module/src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  plugins: [
    require("daisyui"),
    flowbite.plugin(),
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
EOF

echo ""
echo "✅ 模块导出完成！"
echo ""
echo "📍 导出位置: $EXPORT_DIR"
echo ""
echo "接下来的步骤："
echo "1. cd $EXPORT_DIR"
echo "2. npm init (如需修改 package.json)"
echo "3. 在其他项目中使用: npm install ../path/to/$EXPORT_DIR"
echo ""
echo "或发布到 npm:"
echo "1. cd $EXPORT_DIR"
echo "2. npm publish (需要先登录 npm)"
echo ""
