# Security Policy

## Supported Versions

We provide security updates and patches for the following versions of Demuse:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | Yes                |
| < 0.1.0 | No                 |

---

## Security Architecture

Demuse incorporates multiple security measures to protect user data and session integrity:

- **Stateless HTTPOnly Cookie Authentication**: Session tokens are signed via JWT using HS256/jose and stored exclusively in HTTPOnly, Secure, SameSite cookies.
- **No Client Storage for Credentials**: Client-side storage (`localStorage`) is strictly prohibited from storing sensitive credentials or session data.
- **Argon2id Password Hashing**: Passwords are cryptographically salted and hashed prior to persistence.
- **Per-User Isolation**: Database queries enforce tenant boundaries via authenticated user ID lookups.
- **SSL / TLS Integrity**: Database connections require SSL verification (`sslmode=verify-full`).

---

## Reporting a Vulnerability

If you discover a security vulnerability within Demuse, please report it responsibly:

1. **Do not create public GitHub issues** for security vulnerabilities.
2. Email details directly to the project maintainer at `dongduong840@gmail.com` with the subject line `[SECURITY] Demuse Vulnerability Report`.
3. Include detailed steps to reproduce the issue, proof of concept, and potential impact assessment.

### Response Timeline
- We will acknowledge receipt of your vulnerability report within 48 hours.
- We will provide an initial assessment and timeline for a patch within 5 business days.
- A fix will be developed and released prior to public disclosure.
