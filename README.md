<div align="center">

# 🎓 CampusConnect
### *The Exclusive Intra-College Social, Academic & Mentorship Network*
**Connecting 1st, 2nd, 3rd, and 4th-Year Students Within Your Campus**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?style=flat&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 🌟 Vision & Overview

Inspired by the original Harvard **"TheFacebook"** concept (where exclusivity to the college community sparked authentic connections), **CampusConnect** is a modern, student-first platform designed exclusively for your college campus. 

Junior students often find it daunting to approach final-year seniors for project advice, placement materials, or hackathon teams. Meanwhile, seniors graduate each year with battle-tested interview logs, lab manuals, and dorm gear that never reach the incoming batches.

**CampusConnect** bridges this generational campus divide by providing an authentic intra-college ecosystem gated by verified institutional emails (`.ac.in` / `.edu`).

---

## 🚀 Key Modules & Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAMPUSCONNECT ECOSYSTEM                         │
├────────────────────┬─────────────────────┬─────────────────────────────┤
│ 1. Student Network │ 2. Senior Bridge    │ 3. Build Board & Vault      │
├────────────────────┼─────────────────────┼─────────────────────────────┤
│ • 1st-4th Year Dir │ • Ask a Senior Q&A  │ • Hackathon & Project Finder│
│ • Branch & Hostels │ • Placement Logs    │ • Notes & PYQ Vault (1-8 s) │
│ • Mentor Badges    │ • 1-on-1 Mentorship │ • Book & Gear Marketplace   │
│ • Karma Leaderboard│ • Verified Badges   │ • Batch Channels & Realtime │
└────────────────────┴─────────────────────┴─────────────────────────────┘
```

### 1. 👥 The 1st–4th Year Directory (`/directory`)
- **Institution Gated:** Validated college email verification badge.
- **Detailed Student Profile Cards:** Batch year badge (`1st Year - Fresher` to `4th Year - Final`), Branch (`CSE`, `ECE`, `ME`, `Civil`, `EE`, `IT`), Residence status (`Hostel` / `Day Scholar`), Open-to-Mentor toggle, Tech/Creative skill tags, and GitHub/LinkedIn/Portfolio links.
- **Instant Multi-Filter Bar:** Filter peers and seniors by Year, Branch, Skills, Hostel vs. Day Scholar, or Mentorship status.

### 2. 🌉 Senior-Junior Bridge (`/bridge`)
- **"Ask a Senior" Forum:** Dedicated Q&A where freshers and sophomores ask questions about course electives, GPA survival, research labs, or internships, answered with "Verified Senior" badges.
- **Placement & Internship Chronicles:** Real interview debriefs from Google, Microsoft, Amazon, Texas Instruments, Zomato, Goldman Sachs, etc. with round breakdowns, problem statements, and prep roadmaps.
- **1-on-1 Mentorship Directory:** Book mock interviews, resume critiques, and project guidance with experienced 3rd and 4th-year seniors.

### 3. ⚡ Team & Hackathon Finder (`/teams`)
- **"Build Together" Pitch Board:** Discover or post hackathon teams (Smart India Hackathon, EthIndia, Major Capstone, Campus Startups).
- **Slot Tracking:** Visible slots (`2/4 Filled`) and required skill roles.
- **One-Click Apply:** Juniors and peers can apply with their CampusConnect profile card and custom pitch note.

### 4. 📚 Academic & Gear Vault (`/vault`)
- **Notes & PYQ Repository:** Filter through semesters 1–8, branch, and category (PYQs, Handwritten Notes, Lab Manuals, Syllabus).
- **Campus Book & Gear Exchange:** Dorm clearinghouse where passing-out seniors donate or sell engineering drafters, scientific calculators (Casio 991EX), lab coats, bicycles, and textbooks.

### 5. 💬 Batch Channels & Direct Messages (`/messages`)
- Auto-organized channels (`#1st-year-freshers`, `#2nd-year-hub`, `#3rd-year-internships`, `#4th-year-placements`, `#competitive-programming`, `#gate-cat-prep`).
- Real-time chat with code formatting, role badges, and direct messaging.

### 6. 🌐 Campus Pulse & Clubs Hub (`/`, `/clubs`)
- Campus-wide feed with filters for `All Campus`, `My Year`, and `My Department`.
- Directory of student societies (Coding Club, Robotics, E-Cell, Literary Society) with audition dates and lost & found notices.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & App Architecture:** [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling & Components:** [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **State Management & Mock Architecture:** Built-in **Rich Mock Fallback Provider** stored locally so contributors can run the app with 100% functionality out of the box with zero external dependencies.
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL schema, Row Level Security, Auth policies, and Realtime replication).

---

## ⚡ Quickstart Guide (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/your-college/campus-connect.git
cd campus-connect
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> [!TIP]
> **Zero-Config Contributor Mode:** The app includes a rich initial mock dataset covering 1st through 4th-year students, placement chronicles, PYQs, and hackathon cards. You don't need Supabase credentials to explore or build new UI features!

### 4. (Optional) Connect Your Own Supabase Instance
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Create a new Supabase project at [supabase.com](https://supabase.com).
3. Run the SQL script located in `supabase/schema.sql` in your Supabase SQL Editor.
4. Populate `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.

---

## 📂 Project Structure

```
campus-connect/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── workflows/
│       └── ci.yml
├── public/                 # Static assets & icons
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx        # Campus Pulse (Feed)
│   │   ├── layout.tsx      # 3-Column Shell (Sidebar, TopNav, RightBar)
│   │   ├── directory/      # Student Directory & Mentorship filter
│   │   ├── bridge/         # Q&A Forum & Placement Chronicles
│   │   ├── teams/          # Hackathon & Major Project Finder
│   │   ├── vault/          # PYQs, Notes & Dorm Gear Marketplace
│   │   ├── clubs/          # Societies & Lost/Found Hub
│   │   └── messages/       # Batch Channels & Direct Messages
│   ├── components/         # Modular UI & dashboard components
│   │   ├── layout/         # LeftSidebar, TopNavbar, RightSidebar
│   │   ├── modals/         # Modals for Q&A, Teams, Gear, Onboarding
│   │   └── ui/             # Badges, Tabs, Dialogs, Cards
│   ├── context/            # CampusAppContext & Mock State Store
│   ├── data/               # Realistic Mock Seed Dataset
│   ├── lib/                # Supabase client & utility functions
│   └── types/              # Comprehensive TypeScript interfaces
├── supabase/
│   └── schema.sql          # Complete PostgreSQL schema & RLS rules
├── CONTRIBUTING.md         # Guidelines for college open-source contributors
├── CODE_OF_CONDUCT.md     # Contributor Covenant Code of Conduct
├── SECURITY.md             # Security disclosures
└── LICENSE                 # MIT License
```

---

## 🤝 Contributing

We welcome contributions from college students across all branches and years! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) to get started with `good first issue` tasks.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.
