# AGENTS.md — 多代理協作規範（Next.js 15 專案）

> 本文件將你現在的三份規範（`AGENTS.md`、`CLAUDE.md`、`copilot.instructions.md`）合併為**一份**可直接放在專案根目錄的 Agents 規範，供 Claude Code、Copilot Chat、Cursor 等工具作為「系統提示（system prompt）」或「專案說明」。  
> 口訣：**先架構、後切面、再交接**。所有 Agent 都必須遵循下列共同情境與硬性規則。

---

## 0) 專案共同情境（給所有 Agent）

- 框架：**Next.js 15 + TypeScript**（App Router）。
- 套件：**pnpm@10.10.0（固定版本）**、Vitest、Prettier、ESLint、Zod、Zustand、Apollo（GraphQL）。
- 執行：開發伺服器預設 **port 3002**，Turbopack；建置前**一定要先產生環境檔**。  
- 架構關鍵：**8 層流**、**Service Adapter Factory**、**Anti‑Corruption Layer**、**型別安全設定**、**強制中介層**。  
- 客戶端呼叫標準：**只能用 `@/utils/client/api-client`**（禁止直接 `fetch/axios`）。
- UI：**不可直接從 `flowbite-react` 引用**；一律走 `@/components/core/` 抽象層。
- 常見腳本與流程：見「核心命令」章節。
- 目錄定位與命名：見「目錄結構（節錄）」章節。
- 運行時設定（Runtime Config）：**Consul > 本地檔 > Schema 預設**；Server 與 Client 有不同讀取界線。

> **硬性規則（任何 Agent 都不得違反）**  
> 1) API Route 一律套用 `withAuthErrorHandler*` 或 `withDebugOnly*`。  
> 2) 新/改 GraphQL Schema 後必跑 `pnpm graphql:codegen`。  
> 3) Feature Flag/公開設定不得直接由 Client 讀私密設定，**只能用 public helpers**。  
> 4) PR 前跑 `pnpm type-check`、`pnpm lint`、`pnpm format`、必要測試。  
> 5) 任何 UI 元件請優先走核心抽象層（`/src/components/core/`）。

---

## 1) 核心命令（精選）
（貼給聊天助理做自我檢查與建議）
## Essential Commands

**CRITICAL: Always use `pnpm` (version 10.10.0 pinned) - never npm or yarn**

```bash
# Development
pnpm dev              # Start dev server on port 3002 with Turbopack
pnpm dev:https        # Start with experimental HTTPS

# Environment Configuration (REQUIRED before builds)
pnpm env:local        # Generate .env for local development
pnpm env:sit          # Generate .env for SIT environment
pnpm env:uat          # Generate .env for UAT environment
pnpm env:prd          # Generate .env for production

# Building
pnpm build            # Standard build (requires .env already generated)
pnpm build:sit        # Build for SIT (auto-runs env:sit first)
pnpm build:uat        # Build for UAT (auto-runs env:uat first)
pnpm build:prod       # Build for production (auto-runs env:prd first)

# Code Quality
pnpm lint             # Run Next.js ESLint
pnpm type-check       # TypeScript validation (no emit)
pnpm format           # Auto-format with Prettier

# Type Generation
pnpm gen:type         # Generate TypeScript types from OpenAPI spec
pnpm graphql:codegen  # Generate GraphQL typed-document-nodes
pnpm graphql:codegen:watch  # Watch mode for GraphQL codegen

# Testing
pnpm exec vitest      # Run Vitest browser tests

# Deployment
pnpm release          # Execute release workflow
pnpm manual-deploy    # Manual deployment script
```

---

## 2) 8 層架構（MANDATORY）
（每個 Agent 的交接都沿用這條鏈：**UI → Form Handler → API Route → Service → Adapter → Core Utils → Config → Types**）
### 8-Layer Architecture (MANDATORY for all features)

**Critical Flow:** UI → Form Handler → API Route → Service → Adapter → Core Utils → Config → Types

**Key Principles:**
1. **Service Adapter Factory Pattern**: Supports multiple backends (SFTCore, SFTCoreIdentity, FirstCargo_Core)
2. **Anti-Corruption Layer**: Adapters isolate external API changes from business logic
3. **Type-Safe Configuration**: All API names via `ServiceApiName` type from `service.conf.ts`
4. **Mandatory Middleware**: ALL API routes MUST use `withAuthErrorHandler*` or `withDebugOnly*`
5. **Client API Standard**: UI code MUST use `@/utils/client/api-client`, never raw fetch/axios

### Component Architecture

1. **Core Components Layer** (`/src/components/core/`)
   - **NEVER import from 'flowbite-react' directly** - always use core abstraction
   - Examples: `Button.tsx`, `TextInput.tsx`, `Modal.tsx`
   - Centralizes theming with `sj_primary` color system

2. **Layout Components** (`/src/components/layout/`)
   - Sidebar state via `sidebar.context.tsx`, items in `sidebar-items.conf.ts`
   - Navbar with multi-language toggle (controlled by runtime config)

3. **Domain UI Components** (`/src/ui/{domain}/`)
   - Business-specific views and forms
   - Use React Hook Form + Zod for validation
   - Co-locate form handlers: `{feature}-form-handler.ts`

### Runtime Configuration System (CRITICAL)

**All feature flags, service URLs, and public configs managed via runtime-config system:**

- **Server access**: `await getConfig('Features')` - full config with secrets
- **Client access**: ONLY via public helpers (e.g., `isMultiLanguageEnabled()` from `features.public.ts`)
- **Sources**: Consul remote (priority) → local baseline → schema defaults
- **Sections**: Application, Features, ExternalServices, Infras
---

## 3) 目錄結構（節錄）
（用於路徑/匯入判斷與自動產生檔案位置）
### Directory Structure

```
/src
├── app/                        # Next.js App Router pages
│   ├── (authentication)/       # Auth pages (login, signup, etc.)
│   ├── (chub)/                 # Main application pages
│   └── api/                    # API route handlers
├── components/
│   ├── core/                   # Core UI components (NEVER import from 'flowbite-react' directly)
│   └── layout/                 # Layout components (sidebar, navbar)
├── ui/                         # Domain-specific UI components
│   ├── booking/
│   └── logistics/
├── configurations/             # Configuration files
│   ├── route.conf.ts           # Frontend route definitions
│   ├── service.conf.ts         # API endpoint & service configurations
│   └── form-data/              # Form configuration data
├── adapters/                   # Adapter layer (anti-corruption pattern)
├── services/                   # Business logic layer
├── utils/
│   ├── core/                   # Core utilities (service.util.ts for HTTP)
│   └── client/                 # Client-side utilities (api-client.ts)
├── lib/                        # Core functionality libraries
├── types/                      # TypeScript type definitions
├── runtime-config/             # Runtime configuration system
├── storages/                   # Storage utilities (cookies, localStorage)
├── stores/                     # State management (Zustand)
├── hooks/                      # React custom hooks
├── middleware/                 # Next.js middleware
└── validations/                # Validation schemas
```

---

## 4) 運行時設定（Runtime Configuration）
（Server/Client 權限與資料來源順序，Agent 在產生程式碼時必須遵守）
## Runtime Configuration System (CRITICAL)

**All feature flags, service URLs, and public configs managed via runtime-config system:**

- **Server access**: `await getConfig('Features')` - full config with secrets
- **Client access**: ONLY via public helpers (e.g., `isMultiLanguageEnabled()` from `features.public.ts`)
- **Sources**: Consul remote (priority) → local baseline → schema defaults
- **Sections**: Application, Features, ExternalServices, Infrastructure, InternalServices, Authentication
- **Adding flags**: Update `schema.ts` → `local/{Section}.local.json` → `public-fields.ts` (if client-visible)
- **Never import `manager.ts` in client code** - causes webpack errors with fs module

**Common Operations:**
```typescript
// Server: Get full Features config
const features = await getConfig('Features')
if (features.multiLanguage.enabled) { /* ... */ }

// Client: Use public helper
import { isMultiLanguageEnabled } from '@/runtime-config/features.public'
if (isMultiLanguageEnabled()) { /* ... */ }

// Reload config at runtime
POST /api/runtime-config/reload?section=Features&force=true
```

**See `docs/runtime-config-onboarding.md` for 10-minute guide.**

### Data Flow Architecture

1. **Complete API Request Flow (8-Layer Architecture)**

Based on the login functionality implementation, the complete API request flow follows this 8-layer pattern:

**Layer 1: UI Components (`/src/ui/{domain}/`)**

- React components with form handling using React Hook Form + Zod
- Use Controller components for form field management
- Handle user interactions and display feedback

**Layer 2: Form Handler (`{component}-form-handler.ts`)**

- Define Zod validation schemas for form data
- Implement client-side form submission actions (e.g., `loginPostClientAction`)
- Handle form data transformation and client-side validation
- Convert data to appropriate format for API calls (e.g., FormData)

**Layer 3: API Route Handler (`/src/app/api/{domain}/{endpoint}/route.ts`)**

- Next.js App Router API endpoints
- Handle HTTP requests and extract data from request objects
- Convert request data to business objects using TypeScript interfaces
- Call Service layer business logic functions
- Return standardized JSON responses

**Layer 4: Service Layer (`/src/services/{domain}.service.ts`)**

- Business logic processing functions (e.g., `processLogin`, `processSignup`)
- Handle business rules and validation
- Manage side effects (e.g., JWT token storage, cookies)
- Call Adapter layer for external API communication
- Error handling and business logic transformation

**Layer 5: Adapter Layer (`/src/adapters/{domain}/`)**

- Implement Anti-Corruption Layer pattern
- Use Factory pattern for multiple backend service support (`service-adapter.factory.ts`)
- Domain-specific adapters (e.g., `SFTCoreAdapter`, `FirstCargoAdapter`)
- Handle data transformation between internal and external system formats
- Implement interface contracts (e.g., `AuthAdapter`, `BookingAdapter`)

**Layer 6: Core Service Utilities (`/src/utils/core/service.util.ts`)**

- Low-level HTTP request methods (`getApi`, `postApi`, `getApiWithAuth`, `postApiWithAuth`)
- Authentication header management (`TokenManager`)
- Unified error handling and response processing
- Automatic redirection for unauthorized requests

**Layer 7: Configuration Layer**

- **Route Configuration** (`/src/configurations/route.conf.ts`): Frontend route definitions
- **Service Configuration** (`/src/configurations/service.conf.ts`):
  - API endpoint definitions with `ServiceApiName` type safety
  - Service host configurations (`ServiceHost`)
  - HTTP method specifications and path/query parameters
- **Environment Configuration**: Service URLs and credentials

**Layer 8: Type Definitions (`/src/types/service/`)**

- Request/Response interface definitions (e.g., `auth.d.ts`)
- Domain-specific TypeScript types
- Service response wrappers (`SFTResponse<T>`)
- Ensure type safety across all layers

**Standard Implementation Pattern:**

```
UI Component → Form Handler → API Route → Service → Adapter → Core Service → External API
     ↓              ↓           ↓         ↓        ↓          ↓
   Zod Form    Client Action  Route.ts  Business Logic  HTTP Request  External System
```

**Key Architecture Benefits:**

- **Separation of Concerns**: Each layer has distinct responsibilities
- **Type Safety**: End-to-end TypeScript type checking with `ServiceApiName`
- **Adapter Pattern**: Protection against external API changes
- **Factory Pattern**: Support for multiple backend services
- **Consistent Error Handling**: Unified error processing across layers
- **Authentication Management**: Automatic token handling and refresh

### Authentication Flow

1. **Authentication Routes**

- Located in `/src/app/(authentication)/`
- Includes login, signup, password reset pages

2. **Authentication Implementation Pattern**

**Login Flow Example:**

```
1. User submits form → login.view.tsx (UI Component)
2. Form validation → login-form-handler.ts (Zod validation)
3. Client action → loginPostClientAction() (Form Handler)
4. API route call → /api/authentication/login/route.ts (API Route)
5. Business logic → processLogin() in auth.service.ts (Service Layer)
6. External API → via SFTCoreAdapter (Adapter Layer)
7. JWT storage → createJWTToken() (Side Effect)
8. Success redirect → ConfigRoute.Booking.List
```

3. **Authentication Utilities**

- **JWT Token Management**: `/src/storages/jwtToken.cookie.ts`
- **Authentication Adapters**: `/src/adapters/auth/`
- **Service Layer**: `/src/services/auth.service.ts`

4. **Protected Routes & Middleware**

- **Authentication Check**: Automatic redirection via `service.util.ts`
- **Token Refresh**: Handled in Core Service layer
- **Route Protection**: Implemented in service layer with automatic redirects

---

## 5) GraphQL 整合（指令面）
## GraphQL Integration

1. Define queries/mutations in `src/lib/graphql/documents/**/*.graphql`
2. Run `pnpm graphql:codegen` to generate TypeScript types
3. Use generated `TypedDocumentNode` with Apollo Client
4. Schema URL: Configured via `GRAPHQL_SCHEMA_URL` environment variable

---

## 6) Agent 清單與職責

> 每個 Agent 都要回傳**同樣的輸出格式**：
>
> ```json
> {
>   "summary": "一句話總結",
>   "rationale": ["為何這樣設計", "..."],
>   "plan": ["步驟1", "步驟2", "..."],
>   "files": [{"path": "src/...", "action": "create|update", "why": "..."}],
>   "diff": "統一用 *unified* patch (可直接 `git apply`)",
>   "tests": ["建議的 Vitest/Playwright 測試項目"],
>   "checklist": ["型別檢查", "lint", "graphql:codegen", "中介層檢查", "..."],
>   "followups": ["技術債", "風險", "邊界情境"]
> }
> ```

### A. 架構代理（Architect Agent）
**使命**：落地 8 層鏈、界定界面、挑選切面（log、a11y、i18n、監控）。  
**必守**：
- 僅透過 `@/utils/client/api-client` 進 UI→API 互動。
- API Route 強制套 `withAuthErrorHandler* / withDebugOnly*`。
- 新服務必走 **Adapter Factory**，以隔離外部 API 差異（SFTCore、SFTCoreIdentity、FirstCargo_Core）。
- 所有 API 名稱採 `ServiceApiName` 型別（來源：`service.conf.ts`）。

**System Prompt 範本**
```text
你是本專案的架構代理。工作：把需求映射到 8 層鏈，輸出檔案清單與最小增量設計。
請嚴格檢查：中介層是否到位、Adapter 是否覆蓋、型別是否由 conf 衍生。
最後輸出標準 JSON + unified diff + 風險清單。
```

### B. UI/組件代理（UI Agent）
**使命**：以 `@/components/core/` 為唯一入口組件層；樣式整合 Tailwind（遵循 sj_primary 色系）。  
**必守**：
- **不得**直接引用 `flowbite-react`；若缺元件，先增補 core 層再使用。
- 使用 Next.js 15 能力：**RSC、Suspense/Streaming、Metadata API、Link、平行/攔截路由**。

**System Prompt 範本**
```text
你負責 UI。請只從 "@/components/core" 匯入元件。
遇到缺件，先產 core 元件再回到 domain UI。
務必給出 a11y 檢查與 Skeleton/Loading/Empty/Error 狀態建議。
```

### C. 路由與 SEO 代理（Routing & SEO Agent）
**使命**：App Router 規劃、平行/攔截路由、`generateMetadata()`。  
**必守**：輸出 `app/(...)/page.tsx|layout.tsx` 與導航行為；對外連結用 `<Link>` 新 API。

### D. 資料與 Adapter 代理（Data & Adapter Agent）
**使命**：將需求拆為 **Form Handler → API Route → Service → Adapter** 的最細骨架。  
**必守**：
- Form 驗證用 **Zod**；client action 僅處理序列化與錯誤映射。
- Service 統一從 `services/*.service.ts` 封裝，對外呼叫走 Adapter。
- **禁止** UI 直接打外部 API。

**System Prompt 範本（輸出骨架）**
```text
請建立：{{feature}}-form-handler.ts、/app/api/{{domain}}/{{endpoint}}/route.ts、
services/{{domain}}.service.ts、adapters/{{domain}}/... 所需檔案，並附上最小可跑範例。
務必出示 withAuthErrorHandler* 的使用點與 ServiceApiName 型別使用。
```

### E. 表單與驗證代理（Forms Agent）
**使命**：落實 Zod schema + client action 回傳錯誤格式；給出「欄位 → 錯誤訊息」對照。  
**必守**：檔名規則 **`{{feature}}-form-handler.ts`**；提供 Loading/Disable 提示與防連點策略。

### F. GraphQL 代理（GraphQL Agent）
**使命**：管理 `.graphql` 文件、型別產生與 Apollo 用法。  
**必守**：路徑 `src/lib/graphql/documents/**/*.graphql`；**每次變更都要 `pnpm graphql:codegen`**；以 `TypedDocumentNode` 使用。

### G. 狀態管理代理（State/Zustand Agent）
**使命**：規劃 store 與 selector，避免不必要 re-render；僅在需要時使用 client store，優先使用 RSC 取數。

### H. 測試代理（QA Agent）
**使命**：最小化但關鍵的單元測試/元件測試，並給出邊界情境。  
**必守**：
- **Vitest**：測試檔與實作同層（`*.test.ts(x)`）。
- PR 前必跑：`pnpm type-check`、`pnpm lint`、`pnpm format`。

**常見地雷（供自動巡檢）**
- 匯入了伺服器用的 runtime-config 管理碼到 client → **改用 public helpers**。  
- API route 回 401 → **缺或錯中介層**（請加上 `withAuthErrorHandler*`）。  
- Env 缺值 → 忘了 `pnpm env:<stage>`。  
- Flowbite 失效 → 直接從 `flowbite-react` 引入了。  
- GraphQL 型別不對 → 少跑 `pnpm graphql:codegen`。

### I. 鑑權與安全代理（Auth/Security Agent）
**使命**：保護 API route、標準化 JWT cookie 與登入流程。  
**必守**：登入鏈路對齊：UI → Zod 檢驗 → client action → `/api/authentication/login/route.ts` → `auth.service.ts` → `SFTCoreAdapter` → `createJWTToken()`。

### J. i18n / 可近用性 / 效能代理（i18n/a11y/perf Agent）
**使命**：
- i18n 用 **next-intl**（`/messages/en-US.json`、`/messages/zh-TW.json`；設定於 `/src/i18n/config.ts`；受 runtime flag 控制）。
- 效能：盡量以 **RSC** 處理資料與 `Suspense/Streaming`，`React.memo/useCallback/useMemo` 控重渲染。
- a11y：語意化、鍵盤可達、合理 aria。

### K. 文件與 PR 代理（Docs & PR Agent）
**使命**：把變更說清楚、說完整。  
**必守**：
- Commit 前綴：`feat(scope):`、`chore(scope):`、`fix(scope):`…  
- PR 必含：目的摘要、對應 Jira、UI 變更的截圖/GIF、已執行腳本與測試、GraphQL 型別是否更新。

### L. 交付與環境代理（Ops/Release Agent）
**使命**：協助環境檔與建置腳本，檢查漏網之魚。  
**必守**：建置前執行 `pnpm env:sit|uat|prd`；建置指令 `pnpm build:sit|uat|prod`。

---

## 7) 代理協作與交接規則

- **單一事實來源**：所有代理以此檔為準，不各寫各的規則。
- **交接物件**：每位代理的輸出均包含 `plan/files/diff/tests/checklist`，供下一位代理直接承接。
- **衝突解法**：若 UI 與 Data 規則衝突，以 **Architect Agent** 決議為最終（需寫明取捨）。
- **最小可行提交**：每輪產出都能 `git apply` + `pnpm type-check` 通過。

---

## 8) 使用方式（給人類操作者）

- 在 Claude/Copilot 啟動對話時，先貼上本檔「0)～5)」做**上下文**。  
- 再選擇合適的 Agent 範本（A～L）丟一句任務，例如：  
  - 「幫我把 *Booking* 新增 ‘取消訂單’ 流程，請先跑 *Architect → Data → UI → QA* 的 4 段交接。」  
  - 「把登入流程加上 2FA，先給 *Architect* 的最小差分，再交給 *Auth*。」

**快捷提示片段**
```text
[Architect] 請根據 8 層鏈規劃 XXX，輸出 JSON+diff，特別留意中介層與 Adapter。
[Data] 產出 Form Handler / API Route / Service / Adapter 骨架；禁止 raw fetch。
[UI] 僅用 "@/components/core"；附 a11y 與 Loading/Error 狀態。
[QA] 產出 Vitest 測試清單與風險；補常見地雷的巡檢項。
```

---

## 9) 驗收清單（Definition of Done）

- [ ] 有 `diff`、`tests`、`checklist` 三份輸出且可套用。  
- [ ] API Route 皆通過中介層檢查。  
- [ ] GraphQL 型別已更新（如有 Schema 變更）。  
- [ ] Runtime Config 引用點正確（Server vs Client）。  
- [ ] UI 僅用 Core 層；i18n/a11y/perf 項目有回應。  
- [ ] PR 模板內容齊全。

---

### 附註
- 如需拓展到其他 AI 工具，只要沿用輸出格式與交接規則即可。
- 若未來有新規約，請修改本檔，**避免分散在多個 README**。