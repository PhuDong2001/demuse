# Contributing to Demuse

Thank you for your interest in contributing to Demuse. We appreciate your time and effort to improve the project.

---

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure you maintain a respectful, constructive, and inclusive environment.

---

## Development Setup

1. **Prerequisites**:
   - Node.js (v18.18+ or v20+)
   - pnpm (v9+)
   - PostgreSQL database instance (or Neon Serverless PostgreSQL)

2. **Installation**:
   ```bash
   git clone https://github.com/PhuDong2001/demuse.git
   cd demuse
   pnpm install
   ```

3. **Environment Setup**:
   Copy `.env.example` to `.env.local` and provide your database connection string:
   ```bash
   cp .env.example .env.local
   ```

4. **Database Migration**:
   ```bash
   pnpm db:push
   ```

5. **Start Dev Server**:
   ```bash
   pnpm dev
   ```

---

## Commit Guidelines (Conventional Commits)

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` Introduces a new feature to the codebase
- `fix:` Fixes a bug
- `docs:` Documentation changes only
- `refactor:` Code changes that neither fix a bug nor add a feature
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Build process, tooling, or dependency updates

---

## Pull Request Process

1. Create a new branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your modifications following our code style.
3. Validate linting and build checks:
   ```bash
   pnpm lint
   pnpm build
   ```
4. Commit your changes with clear conventional commit messages.
5. Push to your fork and submit a Pull Request against `main`.
6. Provide a detailed summary of changes and verification steps in your PR description.
