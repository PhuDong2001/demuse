# Demuse

Demuse is a modern, modular timetable and personal schedule management application built with Next.js App Router, React 19, TypeScript, TailwindCSS, and PostgreSQL (via Drizzle ORM).

---

## Features

### Daily Timeline & Live Countdown
- Real-time status indicators that detect whether a class is in session, upcoming, or completed for the day.
- Displays classroom locations, instructors, and countdown durations.

### Interactive Weekly Planner
- Dual-view schedule interface supporting desktop weekly grid layouts and mobile daily agenda views.
- Toggle between 5-day (Monday to Friday) and 7-day full-week views.
- Real-time search filter for courses, rooms, and instructor names.

### Real-Time Conflict Detection
- Automatic detection and visual alerts when course time slots overlap.

### Course & Subject Management
- Subject catalog with customizable visual color palettes (Sage, Terracotta, Ochre, Slate, Rose, Pine).
- Associate instructor details, default room assignments, course codes, and syllabus notes.

### Secure Public Sharing
- Cryptographically generated read-only shareable links for classmates, study groups, and academic advisors.
- Instant access revocation and token regeneration.

### Multilingual Support (i18n)
- Built-in multi-language switcher supporting English, Vietnamese, French, and German across all pages, modals, and navigation.

### Mobile-Optimized & Push Notifications
- Progressive Web App (PWA) configuration with service worker support.
- Configurable notification lead times (5, 10, 15, 30, 60 minutes) for mobile and desktop environments.

---

## Technology Stack

- Framework: Next.js 16 (Turbopack, App Router, Server Actions)
- Frontend: React 19, TailwindCSS v4, Reicon React
- Database: PostgreSQL (Neon Serverless)
- ORM: Drizzle ORM
- Authentication: Stateless JWT in HTTPOnly Cookies (Jose, Argon2)
- Schema Validation: Zod

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 9+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PhuDong2001/demuse.git
cd demuse
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
Create a `.env.local` file in the project root:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=verify-full
JWT_SECRET=your_long_random_jwt_secret_at_least_32_characters_long
```

4. Push database schema:
```bash
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

The application will be accessible at `http://localhost:3000`.

---

## Security

- Authentication uses HTTPOnly, Secure, and SameSite strict/lax cookies to mitigate cross-site scripting (XSS) risks.
- Client-side storage (`localStorage`) is restricted strictly to non-sensitive preferences like UI language choices.
- Passwords are securely hashed with Argon2id prior to database persistence.
- Public schedule access uses unpredictable UUID-based tokens with tenant isolation.

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes following Conventional Commits format (`feat: ...`, `fix: ...`, `refactor: ...`).
4. Ensure linting and build checks pass: `pnpm lint && pnpm build`
5. Push to your branch and open a Pull Request.

---

## Code of Conduct

All contributors and maintainers are expected to maintain a professional, respectful, and inclusive environment. Harassment, derogatory comments, or unprofessional behavior will not be tolerated.

---

## License

This project is licensed under the MIT License.
