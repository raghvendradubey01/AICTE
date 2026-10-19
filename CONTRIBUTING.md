# Contributing to CampusConnect 🚀

First off, thank you for considering contributing to **CampusConnect**! Whether you are a 1st-year fresher learning Git or a final-year student polishing your portfolio, this project thrives on intra-college open-source contributions.

---

## 🧭 Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating. We are committed to providing a friendly, safe, and welcoming environment for all students regardless of branch, year, or background.

---

## 🛠️ How to Contribute

### 1. Picking an Issue
- Browse our [Issues](https://github.com/your-college/campus-connect/issues) tab.
- Look for tags like:
  - `good first issue` - Perfect for freshers or new contributors.
  - `help wanted` - Feature requests or enhancements needing community hands.
  - `bug` - Confirmed bugs needing a patch.
  - `ui/ux` - Design refinements and styling improvements.

### 2. Fork and Branch Naming
1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/campus-connect.git
   cd campus-connect
   ```
2. Create a feature branch with a descriptive name:
   - `feat/pyq-upload-modal`
   - `fix/directory-filter-reset`
   - `docs/contributing-setup`

### 3. Development Workflow
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. CampusConnect runs in **Zero-Config Contributor Mode** by default. You can test your changes with rich seed data without needing to configure a personal Supabase instance.

### 4. Commit Message Guidelines
We follow standard conventional commits:
- `feat(directory): add residence filter for day scholars`
- `fix(bridge): resolve upvote counter flicker on Q&A answers`
- `docs(readme): add troubleshooting section for Windows powershell`
- `style(navbar): adjust college badge padding for mobile`

### 5. Submitting a Pull Request (PR)
- Verify that your code builds with zero errors:
  ```bash
  npm run build
  npm run lint
  ```
- Push to your fork:
  ```bash
  git push origin feat/your-feature-name
  ```
- Open a Pull Request pointing to the `main` branch.
- Include a clear description of your changes, screenshots or GIFs of UI updates, and reference the issue number (e.g., `Closes #42`).

---

## 💡 Ideas for Student Contributions
- 📱 Add responsive drawer filters for smaller mobile viewports
- 📊 Add semester CGPA calculator to the Academic Vault
- 🔔 Integrate browser Web Push notifications for mentorship replies
- 🌐 Add department-specific club categorization (e.g., IEEE, ACM, SAE, ASME)

Thank you for helping build a better connected campus community!
