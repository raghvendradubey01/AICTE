# AICTE Approval Monitor
### Autonomous Tracking and Alerting Reminder System

> **Original Description**: *Autonomous tracking and alerting remainder system for institutional AICTE approval processes.*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-22c55e?style=flat)](https://recharts.org/)
[![Web Crypto](https://img.shields.io/badge/Web%20Crypto-SHA--256-indigo?style=flat)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Storage](https://img.shields.io/badge/Storage-Browser%20LocalStorage%20(No%20Backend)-amber?style=flat)]()

---

## 🏛️ Overview

**AICTE Approval Monitor** is a specialized web application engineered to route, track, and monitor AICTE (All India Council for Technical Education) institutional approval applications according to the **Approval Process Handbook (APH 2026-27)**.

Designed with a clean, institutional aesthetic (white background, crisp AICTE blue accents, rounded cards, and plain English labels), the system provides an autonomous deadline reminder engine while strictly maintaining that **all regulatory decisions are made by human officials**.

The application runs entirely inside the browser using **HTML5 LocalStorage** with zero server or database dependencies.

---

## ✨ Key Capabilities & Modules

### 1. 👥 Multi-Persona Role Switcher
Instantly toggle between the four official regulatory personas via the top navigation bar:
- **Institution**: View applicant college progress meters, upload compliance renewal documents, and check next required actions.
- **Regional Officer**: Review regional scrutiny queues, verify affidavits, approve or return applications with mandatory reasons.
- **Bureau Officer**: Supervisory national overview across all 5 regions, monitoring overdue cases and reviewing supervisory escalations.
- **EVC/SAC Committee**: Manage scheduled physical visits, geo-tagged inspection streams, and Standing Hearing Committee hearings.

### 2. ⏱️ Centralized Deadline Engine & Demo Clock
- **SLA Calculation Formula**:
  $$\text{Due Date} = \text{Stage Start Date} + \text{Stage Statutory SLA Days}$$
- **Status Classification**:
  - 🟢 **On track**: More than 7 days remaining
  - 🟡 **Due soon**: 7 days or fewer remaining
  - 🔴 **Overdue**: Due date has passed
- **Simulated Demo Clock**: Top-bar controls (`+1 day`, `+7 days`, `+30 days`, `Reset`) allow instant forward-simulation of time. Every deadline, expiry date, notification, and chart calculation dynamically derives from this simulated clock.

### 3. 📋 Applications Workflow & Human-in-the-Loop Routing
- 25 sample institutions across **North**, **South**, **East**, **West**, and **Central** regions.
- Four official workflow routes (`Only Scrutiny`, `Scrutiny + EVC`, `EVC + SAC/SHC`, `Only EVC`).
- Searchable table with instant multi-filtering (Region, Stage, Status, SLA Deadline).
- Interactive **Stage Timeline Drawer** displaying completed, current, and upcoming stages.
- Regulatory action buttons:
  - **"Approve and move to next stage"**
  - **"Return with reason"** *(Mandatory deficiency justification)*

### 4. 🔔 Automated Milestone Notifications & Escalation Engine
- Milestone reminders triggered at **30 days**, **7 days**, and **1 day** before deadlines, and again upon breach.
- **Supervisory Escalation**: If a case is overdue by more than **3 days**, it is automatically escalated to the Bureau Officer with a dashboard escalation banner: *"X cases escalated since yesterday"*.
- Notification bell dropdown with unread badge counter and simulated email indicator: `"Email sent (simulated)"`.
- Intelligent deduplication prevents repeat triggers for the same case and milestone.

### 5. 📂 Undertakings and Documents Registry
- Tracks essential statutory records (Land Leases, Fire Safety Certificates, Affiliation Letters, Anti-Ragging Undertakings).
- Expiry status (`Valid`, `Expiring in 30 days`, `Expired`) driven by the deadline engine.
- Role-based document actions:
  - **Institution**: Click *"Upload renewal"* (stores file metadata locally).
  - **Officer**: Click *"Verify"* to stamp regulatory compliance.

### 6. 🔒 Cryptographic Tamper-Evident Audit Log (SHA-256)
- Every user action (approve, return, escalate, upload, verify, role switch, SLA configuration) logs timestamp, role, action, case ID, and details.
- Implements a cryptographic **SHA-256 hash chain** via the browser **Web Crypto API** (`window.crypto.subtle`), where each entry contains:
  $$\text{Hash}_n = \text{SHA-256}(\text{Content}_n + \text{Hash}_{n-1})$$
- **"Verify log integrity"**: Validates the cryptographic seal across all entries and reports *"Log is intact"* or pinpoints the first compromised block.
- **"Tamper test"**: Intentionally mutates an old record to demonstrate real-time cryptographic failure detection.

### 7. 📊 Reports & Analytics
- **Region-Wise Pendency and Ageing**: Recharts `ComposedChart` showing pending vs. completed volume alongside average days elapsed.
- **Stage-Wise Bottleneck Analysis**: Recharts `BarChart` comparing active caseload and average turnaround against statutory SLA targets.
- **10 Oldest Pending Cases**: Priority list ranked strictly by days pending.
- **"Download CSV"**: One-click RFC 4180 compliant export of pending cases.

### 8. ⚙️ Settings & Dynamic SLA Configuration (Rules as Configuration)
- Edit statutory SLA days per stage without code modifications:
  - **Scrutiny**: Default 15 days *(Regional Officer)*
  - **EVC**: Default 10 days *(EVC/SAC Committee)*
  - **SAC/SHC**: Default 7 days *(EVC/SAC Committee)*
- Updating SLA limits immediately cascades across all active cases, dashboards, and bottleneck charts.
- **"Reset Demo Data"**: Restores all 25 sample records, documents, demo clock, notifications, and cryptographic hash chains to initial statutory defaults.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: [Tailwind CSS v3.4](https://tailwindcss.com/)
- **Charts & Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Cryptography**: Native Web Crypto API (`window.crypto.subtle`)
- **Storage**: Browser HTML5 LocalStorage

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/raghvendradubey01/AICTE.git

# Navigate to project directory
cd AICTE

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to explore the portal.

---

## 📁 Project Structure

```
├── rules.js                           # Core statutory workflow rules & SLA formulas
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Role-adaptive Dashboard
│   │   ├── applications/              # Searchable applications table & detail drawer
│   │   ├── evc-queue/                 # EVC inspection hearing queue
│   │   ├── documents/                 # Undertakings & document compliance registry
│   │   ├── reports/                   # Pendency, bottleneck charts & CSV download
│   │   ├── audit-log/                 # Cryptographic SHA-256 audit log verifier
│   │   ├── settings/                  # SLA days configuration & demo reset
│   │   └── globals.css                # Tailwind base styles & color tokens
│   ├── components/
│   │   ├── layout/                    # Sidebar, TopBar, DemoClock
│   │   ├── dashboard/                 # Role-specific dashboard sub-components
│   │   ├── applications/              # StageTimeline, ApplicationDetailDrawer
│   │   └── common/                    # PageHeader
│   ├── context/
│   │   └── AicteContext.tsx           # Global state, demo clock, notifications, SLA config
│   ├── data/
│   │   ├── rules.ts                   # Workflow routes & stage definitions
│   │   ├── sampleApplications.ts      # 25 sample institutional cases across 5 regions
│   │   ├── sampleDocuments.ts         # Document compliance records
│   │   └── initialChainedLogs.ts      # Initial cryptographically sealed audit chain
│   ├── lib/
│   │   ├── deadlineEngine.ts          # Universal deadline calculation formula
│   │   ├── notificationEngine.ts      # Automated reminder & escalation triggers
│   │   └── cryptoLog.ts               # SHA-256 Web Crypto hash chain verifier
│   └── types/
│       └── aicte.ts                   # TypeScript interfaces & types
└── tailwind.config.js                 # Tailwind design system configuration
```

---

## 📜 License
This project is licensed under the MIT License.
