<p align="center">
  <img src="src/public/logo.svg" alt="PASTI SIP Logo" width="120" />
</p>

# Ayuk Hapan QRIS (MVP)

> A full-stack web application designed for monitoring QRIS expansion as part of the **PASTI SIP – Ayuk Hapan QRIS** program.

---

## 📖 Overview

Ayuk Hapan QRIS is a comprehensive platform built to streamline the onboarding and readiness checklist process for QRIS expansion. It serves two main roles: Payment Service Providers (PJP) and Bank Indonesia (BI) administrators. The platform ensures timely monitoring with SLA tracking, provides real-time dashboard analytics, and logs every audit trail securely.

## ✨ Key Features

- **Role-Based Access Control (RBAC):** Secure registration and login for `PJP` and `BI` roles.
- **Dark Mode Support:** Automatic dark mode based on system preferences.
- **Readiness Checklist Management:** PJP users can input readiness checklists with automated SLA H+2 tracking (categorized as `on_time` or `late`).
- **Real-Time BI Dashboard:** Refreshes data dynamically (30-second polling) featuring:
  - Hero metrics overview.
  - Weekly onboarding trends.
  - SLA compliance table per PJP.
  - Detailed list of SLA delays.
- **Audit Trail:** Comprehensive logging when checklists are edited or deleted.
- **Data Export:** Easily export checklist data to CSV format.
- **Delay Notifications:** Automated notification system for delays (currently simulated via `console.log`).

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS Templating, Chart.js (for analytics)
- **Database:** Prisma ORM, SQLite (via `@prisma/adapter-libsql`)
- **Authentication:** Session-based Auth, `bcryptjs` for secure password hashing

## 🚀 Getting Started

Follow these steps to set up and run the application locally.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or newer recommended)
- npm (Node Package Manager)

### Installation & Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Prepare the database:**
   Synchronize the database schema and seed the initial data:
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *Alternatively, use `npm start` for production mode.*

4. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

### Running with Docker

Alternatively, you can run the application fully containerized using Docker and Docker Compose.

1. **Build and start the container:**
   ```bash
   docker compose up -d --build
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

   *Note: On first startup, the database is mapped to `dev.db` locally. You might need to seed it manually by running `npm run db:push` and `npm run db:seed` in your terminal if you have not run them before.*

---

## 🔐 Default Accounts

Upon running the database seed (`npm run db:seed`), the following default accounts are created for testing purposes:

| Role | Email | Password |
|------|-------|----------|
| **BI Admin** | `bi.admin@bi.go.id` | `password123` |
| **PJP User** | `pjp.lapangan@bank.id` | `password123` |

---

## 📊 SLA Logic

Service Level Agreement (SLA) compliance is calculated based on the difference between the visit date and the submission date (`submitted_at`):

- **On Time (`on_time`):** Submission delay is `<= 2 days`.
- **Late (`late`):** Submission delay is `> 2 days`.

---

## 📂 Core Architecture

- `src/server.js`: The main entry point containing the API, authentication logic, and page rendering routes.
- `src/views/*`: Contains all UI templates for both PJP and BI dashboards (EJS files).
- `prisma/schema.prisma`: The database schema definition encompassing `User`, `Checklist`, and `AuditLog` models.

---

> Built with ❤️ for robust and scalable monitoring.
