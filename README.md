<p align="center">
  <img src="src/public/logo.svg" alt="PASTI SIP Logo" width="120" />
</p>

<h1 align="center">Ayuk Hapan QRIS</h1>

<p align="center">
  <strong>QRIS Expansion Monitoring Platform · PASTI SIP Program</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
</p>

---

## 📖 Overview

**Ayuk Hapan QRIS** is a full-stack web platform built to streamline the onboarding and readiness checklist process for QRIS (Quick Response Code Indonesian Standard) expansion under the **PASTI SIP** program.

The platform serves two primary roles — **Payment Service Providers (PJP)** and **Bank Indonesia (BI) administrators** — providing end-to-end visibility into the expansion pipeline with automated SLA enforcement, real-time dashboards, and tamper-evident audit trails.

---

## ✨ Features

### 🔐 Role-Based Access Control
Separate, secure authentication flows for `PJP` and `BI Admin` roles, ensuring users only access data and actions relevant to their responsibilities.

### 📋 Readiness Checklist Management
PJP users can submit and manage readiness checklists tied to their QRIS onboarding visits. The system automatically calculates SLA compliance from the moment a checklist is submitted.

### 📊 Real-Time BI Dashboard
A live monitoring dashboard for Bank Indonesia administrators, refreshed every 30 seconds, featuring:
- **Hero Metrics** — high-level KPIs at a glance
- **Weekly Onboarding Trends** — Chart.js-powered visualizations
- **SLA Compliance Table** — breakdown per PJP
- **Delay Detail List** — actionable view of all late submissions

### ⏱️ Automated SLA Tracking
SLA status is computed automatically from the difference between visit date and `submitted_at`:

| Status | Condition |
|--------|-----------|
| ✅ `on_time` | Submission within ≤ 2 days of visit |
| ❌ `late` | Submission after > 2 days of visit |

### 🗂️ Audit Trail
Every edit and deletion of a checklist entry is logged immutably, ensuring full traceability for compliance and review purposes.

### 📤 CSV Export
BI administrators can export checklist data to CSV with a single click for offline reporting and analysis.

### 🔔 Delay Notifications
An automated notification system alerts relevant parties when SLA thresholds are breached. *(Currently simulated via `console.log`; production integration is configurable.)*

### 🌙 Dark Mode
Automatic dark mode based on the user's system preference — no configuration required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js (v16+) |
| **Web Framework** | Express.js |
| **Templating** | EJS |
| **ORM** | Prisma (`@prisma/adapter-libsql`) |
| **Database** | SQLite |
| **Authentication** | Session-based auth · `bcryptjs` |
| **Charts** | Chart.js |
| **Containerization** | Docker · Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) **v16.x or newer**
- **npm** (bundled with Node.js)

### Local Development

**1. Install dependencies:**
```bash
npm install
```

**2. Set up the database:**

Push the Prisma schema and seed initial data:
```bash
npm run db:push
npm run db:seed
```

**3. Start the development server:**
```bash
npm run dev
```

> For production mode, use `npm start` instead.

**4. Open the application:**

Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

### 🐳 Docker

Run the entire application in a self-contained environment using Docker Compose.

**Build and start the container:**
```bash
docker compose up -d --build
```

**Access the application:**

Navigate to [http://localhost:3000](http://localhost:3000).

> **Note:** On first startup, the database file is mapped to `dev.db` locally. If the app starts without seeded data, run the following in your terminal:
> ```bash
> npm run db:push && npm run db:seed
> ```

---

## 🔐 Default Accounts

The seed script (`npm run db:seed`) provisions the following test accounts:

| Role | Email | Password |
|------|-------|----------|
| **BI Admin** | `bi.admin@bi.go.id` | `password123` |
| **PJP User** | `pjp.lapangan@bank.id` | `password123` |

> ⚠️ Change these credentials before deploying to any non-development environment.

---

## 📂 Project Structure

```
.
├── prisma/
│   └── schema.prisma        # Database schema (User, Checklist, AuditLog)
├── src/
│   ├── public/              # Static assets (logo, CSS, JS)
│   ├── views/               # EJS templates for PJP and BI dashboards
│   └── server.js            # Application entry point (routes, auth, API)
├── docker-compose.yml
└── package.json
```

### Key Modules

- **`src/server.js`** — Main entry point. Handles authentication middleware, route definitions, API endpoints, and page rendering.
- **`src/views/`** — EJS templates for all UI surfaces: login, PJP checklist forms, and the BI monitoring dashboard.
- **`prisma/schema.prisma`** — Defines three core models: `User`, `Checklist`, and `AuditLog`.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with hot-reload (development) |
| `npm start` | Start server (production) |
| `npm run db:push` | Sync Prisma schema to the database |
| `npm run db:seed` | Seed the database with default accounts and data |

---

## 🗺️ Roadmap

- [ ] Replace `console.log` delay notifications with real email/webhook integration
- [ ] Add pagination to the SLA delay list
- [ ] Support multi-database backends (PostgreSQL, MySQL)
- [ ] Implement refresh token rotation for enhanced session security
- [ ] Role management UI for BI admins

---

<p align="center">Built with ❤️ for the <strong>PASTI SIP – Ayuk Hapan QRIS</strong> program.<br/>Robust, traceable, and built for scale.</p>
