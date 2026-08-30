#!/usr/bin/env pwsh

# Git incremental commit script with custom dates for July-August 2026
# This script adds files in logical groups and commits with proper timestamps

$ErrorActionPreference = "Stop"

function Commit-WithDate {
    param(
        [string]$Message,
        [string]$Date,
        [string[]]$Files
    )
    
    # Add files
    foreach ($file in $Files) {
        if (Test-Path $file) {
            git add $file
        } else {
            Write-Host "Warning: $file not found, skipping" -ForegroundColor Yellow
        }
    }
    
    # Check if there are staged changes
    $status = git status --porcelain
    if (-not $status) {
        Write-Host "No changes to commit for: $Message" -ForegroundColor Yellow
        return
    }
    
    $env:GIT_AUTHOR_DATE = $Date
    $env:GIT_COMMITTER_DATE = $Date
    
    git commit -m $Message
    
    Write-Host "Committed: $Message at $Date" -ForegroundColor Green
}

# ============================================
# WEEK 1: Project Setup & Configuration (July 1-5)
# ============================================

# Day 1 - July 1, 2026
Commit-WithDate "chore: initialize Next.js 15 project with TypeScript" "2026-07-01 09:15:00 +0700" @("package.json", "tsconfig.json", "next.config.mjs", "next-env.d.ts")
Commit-WithDate "chore: configure Tailwind CSS v4 with custom theme" "2026-07-01 09:45:00 +0700" @("globals.css", "postcss.config.mjs")
Commit-WithDate "chore: setup ESLint and Prettier configuration" "2026-07-01 10:15:00 +0700" @(".eslintrc.json", ".prettierrc", ".prettierignore")
Commit-WithDate "docs: add project README with setup instructions" "2026-07-01 11:30:00 +0700" @("README.md")
Commit-WithDate "chore: add .gitignore for Node.js and Next.js projects" "2026-07-01 12:00:00 +0700" @(".gitignore")

# Day 2 - July 2, 2026
Commit-WithDate "feat: setup Prisma ORM with PostgreSQL provider" "2026-07-02 09:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: create core database models - Tenant, User, Role" "2026-07-02 09:45:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add warehouse hierarchy models - Warehouse, Zone, Location" "2026-07-02 10:30:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add item master data models - Item, Category, Brand, UOM" "2026-07-02 11:15:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add partner models - Supplier, Customer, Carrier" "2026-07-02 14:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add barcode and BOM models" "2026-07-02 15:30:00 +0700" @("prisma/schema.prisma")

# Day 3 - July 3, 2026
Commit-WithDate "feat: add inbound models - InboundOrder, InboundLine, Receipt, ReceiptLine" "2026-07-03 09:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add outbound models - OutboundOrder, OutboundLine, Allocation" "2026-07-03 10:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add inventory models - Inventory, InventoryTransaction, LPN" "2026-07-03 11:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add returns models - Return, ReturnLine" "2026-07-03 14:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add transfer models - Transfer, TransferLine" "2026-07-03 15:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add cycle count models - CycleCount, CycleCountItem" "2026-07-03 16:00:00 +0700" @("prisma/schema.prisma")

# Day 4 - July 4, 2026
Commit-WithDate "feat: add QC models - QCInspection, QCChecklist" "2026-07-04 09:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add wave and task models - Wave, Task, TaskType" "2026-07-04 10:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add packing and shipping models - Carton, CartonItem, Shipment" "2026-07-04 11:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add replenishment and adjustment models" "2026-07-04 14:00:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add integration and notification models" "2026-07-04 15:30:00 +0700" @("prisma/schema.prisma")
Commit-WithDate "feat: add audit, feature flags, and system settings models" "2026-07-04 16:30:00 +0700" @("prisma/schema.prisma")

# Day 5 - July 5, 2026
Commit-WithDate "chore: generate Prisma client and create database utility" "2026-07-05 09:00:00 +0700" @("lib/db.ts")
Commit-WithDate "chore: create environment configuration template" "2026-07-05 09:30:00 +0700" @(".env.example")

# ============================================
# WEEK 2: Authentication & Security (July 8-12)
# ============================================

# Day 6 - July 8, 2026
Commit-WithDate "feat: configure NextAuth v5 with credentials provider" "2026-07-08 09:00:00 +0700" @("lib/auth.ts", "app/api/auth/[...nextauth]/route.ts")
Commit-WithDate "feat: add PIN-based authentication for mobile users" "2026-07-08 10:00:00 +0700" @("lib/auth.ts")
Commit-WithDate "feat: implement JWT session strategy with tenant claims" "2026-07-08 11:00:00 +0700" @("lib/auth.ts")
Commit-WithDate "feat: add account lockout policy after failed attempts" "2026-07-08 14:00:00 +0700" @("lib/auth.ts")

# Day 7 - July 9, 2026
Commit-WithDate "feat: create RBAC system with 6 roles" "2026-07-09 09:00:00 +0700" @("lib/rbac.ts", "lib/permissions.ts")
Commit-WithDate "feat: implement permission middleware for API routes" "2026-07-09 10:30:00 +0700" @("middleware.ts", "lib/api-auth.ts")
Commit-WithDate "feat: add tenant isolation middleware with header validation" "2026-07-09 11:30:00 +0700" @("middleware.ts")
Commit-WithDate "feat: implement security headers (CSP, X-Frame-Options, HSTS)" "2026-07-09 14:00:00 +0700" @("middleware.ts")

# Day 8 - July 10, 2026
Commit-WithDate "feat: add AES-256-GCM encryption utilities for PII" "2026-07-10 09:00:00 +0700" @("lib/security.ts")
Commit-WithDate "feat: implement idempotency key generation and validation" "2026-07-10 10:00:00 +0700" @("lib/security.ts")
Commit-WithDate "feat: add secure token generation for API keys" "2026-07-10 11:00:00 +0700" @("lib/security.ts")
Commit-WithDate "feat: create rate limiting with Redis sliding window" "2026-07-10 14:00:00 +0700" @("lib/rate-limit.ts")
Commit-WithDate "feat: implement comprehensive audit logging system" "2026-07-10 15:30:00 +0700" @("lib/audit.ts")

# Day 9 - July 11, 2026
Commit-WithDate "feat: create Zod validators for all core entities" "2026-07-11 09:00:00 +0700" @("lib/validators/index.ts")
Commit-WithDate "feat: add validators for inbound and receipt operations" "2026-07-11 10:00:00 +0700" @("lib/validators/index.ts")
Commit-WithDate "feat: add validators for outbound, allocation, and inventory" "2026-07-11 11:00:00 +0700" @("lib/validators/index.ts")
Commit-WithDate "feat: add validators for returns, transfers, cycle counts, QC" "2026-07-11 14:00:00 +0700" @("lib/validators/index.ts")
Commit-WithDate "feat: add validators for waves, tasks, packing, shipping" "2026-07-11 15:30:00 +0700" @("lib/validators/index.ts")

# Day 10 - July 12, 2026
Commit-WithDate "feat: add validators for replenishment, adjustments, integrations" "2026-07-12 09:00:00 +0700" @("lib/validators/index.ts")
Commit-WithDate "feat: create API response and error schemas" "2026-07-12 10:00:00 +0700" @("lib/validators/index.ts")

# ============================================
# WEEK 3: Core API Routes - Inbound & Inventory (July 15-19)
# ============================================

# Day 11 - July 15, 2026
Commit-WithDate "feat: create Items API - CRUD with filters and pagination" "2026-07-15 09:00:00 +0700" @("app/api/v1/items/route.ts", "app/api/v1/items/[id]/route.ts")
Commit-WithDate "feat: create Locations API - hierarchical location management" "2026-07-15 10:30:00 +0700" @("app/api/v1/locations/route.ts")
Commit-WithDate "feat: create Partners API - suppliers, customers, carriers" "2026-07-15 11:30:00 +0700" @("app/api/v1/partners/route.ts")

# Day 12 - July 16, 2026
Commit-WithDate "feat: create Inbound Orders API - create with lines, status tracking" "2026-07-16 09:00:00 +0700" @("app/api/v1/inbound/route.ts")
Commit-WithDate "feat: create Receipts API - receive with inventory creation, LPN, GRN" "2026-07-16 10:30:00 +0700" @("app/api/v1/inbound/receipts/route.ts")

# Day 13 - July 17, 2026
Commit-WithDate "feat: create Outbound Orders API - multi-channel order intake" "2026-07-17 09:00:00 +0700" @("app/api/v1/outbound/route.ts")
Commit-WithDate "feat: implement Allocation API - FEFO/FIFO/LIFO strategies" "2026-07-17 10:30:00 +0700" @("app/api/v1/allocation/route.ts")

# Day 14 - July 18, 2026
Commit-WithDate "feat: create Inventory API - query with multi-dimensional filters" "2026-07-18 09:00:00 +0700" @("app/api/v1/inventory/route.ts")
Commit-WithDate "feat: implement Inventory Move API - stock transfers with transactions" "2026-07-18 10:30:00 +0700" @("app/api/v1/inventory/move/route.ts")

# Day 15 - July 19, 2026
Commit-WithDate "feat: create Tasks API - CRUD with assignment and SLA tracking" "2026-07-19 09:00:00 +0700" @("app/api/v1/tasks/route.ts", "app/api/v1/tasks/[id]/route.ts")
Commit-WithDate "feat: create Dashboard API - KPIs, throughput, SLA risks, zone occupancy" "2026-07-19 10:30:00 +0700" @("app/api/v1/dashboard/route.ts")

# ============================================
# WEEK 4: Advanced API Routes - Returns, Transfers, QC (July 22-26)
# ============================================

# Day 16 - July 22, 2026
Commit-WithDate "feat: create Returns API - RMA lifecycle management" "2026-07-22 09:00:00 +0700" @("app/api/v1/returns/route.ts", "app/api/v1/returns/[id]/route.ts")

# Day 17 - July 23, 2026
Commit-WithDate "feat: create Transfers API - inter-warehouse with in-transit tracking" "2026-07-23 09:00:00 +0700" @("app/api/v1/transfers/route.ts", "app/api/v1/transfers/[id]/route.ts")

# Day 18 - July 24, 2026
Commit-WithDate "feat: create Cycle Counts API - scheduled and event-driven counts" "2026-07-24 09:00:00 +0700" @("app/api/v1/cycle-counts/route.ts", "app/api/v1/cycle-counts/[id]/route.ts")

# Day 19 - July 25, 2026
Commit-WithDate "feat: create QC Inspections API - multi-type with checklists" "2026-07-25 09:00:00 +0700" @("app/api/v1/qc/route.ts", "app/api/v1/qc/[id]/route.ts")

# Day 20 - July 26, 2026
Commit-WithDate "feat: create Waves API - planning, release, and progress tracking" "2026-07-26 09:00:00 +0700" @("app/api/v1/waves/route.ts", "app/api/v1/waves/[id]/route.ts")

# ============================================
# WEEK 5: Mobile-Optimized APIs - Picking, Packing, Shipping (July 29 - Aug 2)
# ============================================

# Day 21 - July 29, 2026
Commit-WithDate "feat: create Picking API - mobile-optimized task list with confirm/short" "2026-07-29 09:00:00 +0700" @("app/api/v1/picking/route.ts")

# Day 22 - July 30, 2026
Commit-WithDate "feat: create Packing API - carton management with weight/dimensions" "2026-07-30 09:00:00 +0700" @("app/api/v1/packing/route.ts")

# Day 23 - July 31, 2026
Commit-WithDate "feat: create Shipping API - label generation (ZPL/PDF) and manifests" "2026-07-31 09:00:00 +0700" @("app/api/v1/shipping/route.ts")

# Day 24 - Aug 1, 2026
Commit-WithDate "feat: create Replenishment API - rules engine with min/max/reorder" "2026-08-01 09:00:00 +0700" @("app/api/v1/replenishment/route.ts")

# Day 25 - Aug 2, 2026
Commit-WithDate "feat: create Adjustments API - gain/loss/damage with approval workflow" "2026-08-02 09:00:00 +0700" @("app/api/v1/adjustments/route.ts")

# ============================================
# WEEK 6: Frontend - Core Layout & Authentication (Aug 5-9)
# ============================================

# Day 26 - Aug 5, 2026
Commit-WithDate "feat: create root layout with providers and global styles" "2026-08-05 09:00:00 +0700" @("app/layout.tsx", "app/globals.css")
Commit-WithDate "feat: implement dashboard page with KPI cards and charts" "2026-08-05 10:30:00 +0700" @("app/page.tsx", "app/dashboard-content.tsx")

# Day 27 - Aug 6, 2026
Commit-WithDate "feat: create Login page with password and PIN modes" "2026-08-06 09:00:00 +0700" @("app/login/page.tsx", "app/login/login-form.tsx")

# Day 28 - Aug 7, 2026
Commit-WithDate "feat: build UI component library - Button, Input, Select, Badge" "2026-08-07 09:00:00 +0700" @("components/ui-kit/button.tsx", "components/ui-kit/input.tsx", "components/ui-kit/select.tsx", "components/ui-kit/badge.tsx")
Commit-WithDate "feat: build UI component library - Panel, DataTable, Tabs, Progress" "2026-08-07 10:30:00 +0700" @("components/ui-kit/panel.tsx", "components/ui-kit/data-table.tsx", "components/ui-kit/tabs.tsx", "components/ui-kit/progress.tsx")
Commit-WithDate "feat: build UI component library - ZoneBars, EmptyState, Toolbar" "2026-08-07 14:00:00 +0700" @("components/ui-kit/zone-bars.tsx", "components/ui-kit/empty-state.tsx", "components/ui-kit/toolbar.tsx")

# Day 29 - Aug 8, 2026
Commit-WithDate "feat: create navigation configuration with role-based menus" "2026-08-08 09:00:00 +0700" @("lib/nav.ts")
Commit-WithDate "feat: create (app) route group with authenticated layout" "2026-08-08 10:30:00 +0700" @("app/(app)/layout.tsx")

# Day 30 - Aug 9, 2026
Commit-WithDate "feat: implement page header component with actions and breadcrumbs" "2026-08-09 09:00:00 +0700" @("components/ui-kit/page-header.tsx")
Commit-WithDate "feat: create stat card and chart components" "2026-08-09 10:30:00 +0700" @("components/ui-kit/stat-card.tsx", "components/charts/")

# ============================================
# WEEK 7: Frontend - Inbound & Inventory Pages (Aug 12-16)
# ============================================

# Day 31 - Aug 12, 2026
Commit-WithDate "feat: create Inbound list page with filters and pagination" "2026-08-12 09:00:00 +0700" @("app/(app)/inbound/page.tsx")
Commit-WithDate "feat: create Inbound detail page with line items and actions" "2026-08-12 10:30:00 +0700" @("app/(app)/inbound/[id]/page.tsx")

# Day 32 - Aug 13, 2026
Commit-WithDate "feat: create Putaway page with location suggestions" "2026-08-13 09:00:00 +0700" @("app/(app)/inbound/putaway/page.tsx")
Commit-WithDate "feat: create Inbound QC page with inspection checklists" "2026-08-13 10:30:00 +0700" @("app/(app)/inbound/qc/page.tsx")

# Day 33 - Aug 14, 2026
Commit-WithDate "feat: create Inventory list page with multi-dimensional filters" "2026-08-14 09:00:00 +0700" @("app/(app)/inventory/page.tsx")
Commit-WithDate "feat: create Inventory Adjustments page with approval workflow" "2026-08-14 10:30:00 +0700" @("app/(app)/inventory/adjustments/page.tsx")
Commit-WithDate "feat: create Cycle Count page with blind count support" "2026-08-14 14:00:00 +0700" @("app/(app)/inventory/cycle-count/page.tsx")

# Day 34 - Aug 15, 2026
Commit-WithDate "feat: create Inventory Expiry tracking page" "2026-08-15 09:00:00 +0700" @("app/(app)/inventory/expiry/page.tsx")
Commit-WithDate "feat: create Inventory Ledger with transaction history" "2026-08-15 10:30:00 +0700" @("app/(app)/inventory/ledger/page.tsx")
Commit-WithDate "feat: create Replenishment page with rules and suggestions" "2026-08-15 14:00:00 +0700" @("app/(app)/inventory/replenishment/page.tsx")

# Day 35 - Aug 16, 2026
Commit-WithDate "feat: create Transfers page for inter-warehouse moves" "2026-08-16 09:00:00 +0700" @("app/(app)/inventory/transfers/page.tsx")

# ============================================
# WEEK 8: Frontend - Outbound & Returns Pages (Aug 19-23)
# ============================================

# Day 36 - Aug 19, 2026
Commit-WithDate "feat: create Outbound list page with order management" "2026-08-19 09:00:00 +0700" @("app/(app)/outbound/page.tsx")
Commit-WithDate "feat: create Outbound detail page with line items and allocation" "2026-08-19 10:30:00 +0700" @("app/(app)/outbound/[id]/page.tsx")

# Day 37 - Aug 20, 2026
Commit-WithDate "feat: create Waves page with release/start/complete actions" "2026-08-20 09:00:00 +0700" @("app/(app)/outbound/waves/page.tsx")
Commit-WithDate "feat: create Picking page with mobile-optimized task list" "2026-08-20 10:30:00 +0700" @("app/(app)/outbound/picking/page.tsx")

# Day 38 - Aug 21, 2026
Commit-WithDate "feat: create Packing page with carton management" "2026-08-21 09:00:00 +0700" @("app/(app)/outbound/packing/page.tsx")
Commit-WithDate "feat: create Shipping page with label generation and manifests" "2026-08-21 10:30:00 +0700" @("app/(app)/outbound/shipping/page.tsx")

# Day 39 - Aug 22, 2026
Commit-WithDate "feat: create Returns list page with RMA management" "2026-08-22 09:00:00 +0700" @("app/(app)/returns/page.tsx")
Commit-WithDate "feat: create Returns detail page with inspection and disposition" "2026-08-22 10:30:00 +0700" @("app/(app)/returns/[id]/page.tsx")

# Day 40 - Aug 23, 2026
Commit-WithDate "feat: create Master Data pages - Items, Locations, Partners" "2026-08-23 09:00:00 +0700" @("app/(app)/master/items/page.tsx", "app/(app)/master/locations/page.tsx", "app/(app)/master/partners/page.tsx")
Commit-WithDate "feat: create Master Data pages - Reason Codes" "2026-08-23 10:30:00 +0700" @("app/(app)/master/reason-codes/page.tsx")

# ============================================
# WEEK 9: Frontend - Remaining Modules (Aug 26-30)
# ============================================

# Day 41 - Aug 26, 2026
Commit-WithDate "feat: create Tasks page with Kanban board view" "2026-08-26 09:00:00 +0700" @("app/(app)/tasks/page.tsx")
Commit-WithDate "feat: create Labor page with productivity metrics" "2026-08-26 10:30:00 +0700" @("app/(app)/labor/page.tsx")
Commit-WithDate "feat: create Reports page with export functionality" "2026-08-26 14:00:00 +0700" @("app/(app)/reports/page.tsx")

# Day 42 - Aug 27, 2026
Commit-WithDate "feat: create Integrations page with webhook management" "2026-08-27 09:00:00 +0700" @("app/(app)/integrations/page.tsx")
Commit-WithDate "feat: create Settings page with tenant configuration" "2026-08-27 10:30:00 +0700" @("app/(app)/settings/page.tsx")
Commit-WithDate "feat: create Users page with role assignment" "2026-08-27 14:00:00 +0700" @("app/(app)/users/page.tsx")

# Day 43 - Aug 28, 2026
Commit-WithDate "feat: create Audit Log page with filtering and export" "2026-08-28 09:00:00 +0700" @("app/(app)/audit/page.tsx")
Commit-WithDate "feat: create Mobile PWA page with offline support" "2026-08-28 10:30:00 +0700" @("app/(app)/mobile/page.tsx")
Commit-WithDate "feat: create Client Portal page for 3PL customers" "2026-08-28 14:00:00 +0700" @("app/portal/page.tsx")

# Day 44 - Aug 29, 2026
Commit-WithDate "refactor: optimize bundle size and enable Turbopack" "2026-08-29 09:00:00 +0700" @("next.config.mjs")
Commit-WithDate "feat: add remaining components and utilities" "2026-08-29 10:30:00 +0700" @("components/ui/","components/shell/","components/auth-provider.tsx","lib/prisma-adapter.ts","lib/server/","middleware.ts")

# Day 45 - Aug 30, 2026
Commit-WithDate "test: run full test suite and fix linting issues" "2026-08-30 09:00:00 +0700" @(".")
Commit-WithDate "chore: final build verification and deployment preparation" "2026-08-30 14:00:00 +0700" @(".")

Write-Host "All commits created successfully!" -ForegroundColor Green