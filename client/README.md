# AI ERP Platform - Frontend (Angular 19)

Phase 1 MVP frontend for the AI/LLM ERP multi-tenant SaaS platform.

## Tech Stack

- Angular 19 (standalone components)
- Tailwind CSS v4
- Reactive Forms
- Lazy-loaded routes

## Getting Started

```bash
npm install
npm start
```

Open `http://localhost:4200`

## MVP Pages

### Public Website
- Home (`/`)
- Pricing (`/pricing`)
- Sign Up (`/signup`)
- Login (`/login`)

### Super Admin Portal (`/super-admin`)
- Dashboard, Tenant Requests, Tenants, Plans, Payments

### Tenant Admin Portal (`/tenant-admin`)
- Dashboard, Users, Roles, AI Chat, Billing

### Employee Portal (`/employee`)
- Dashboard, AI Chat

## Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@ai-erp.com | password |
| Tenant Admin | admin@company.com | password |
| Employee | employee@company.com | password |

## Features

- **Auth UI** — Split-card login/signup theme with welcome panel
- **Dashboard Layout** — Toggle sidebar (collapse on desktop, overlay on mobile), sticky header
- **Responsive** — Mobile-first design across all portals
- **Mock Data** — Frontend-only with in-memory API service (no backend required)

## Build

```bash
npm run build
```

Output: `dist/ai-erp`
