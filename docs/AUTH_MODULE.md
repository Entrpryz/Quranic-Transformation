# Auth Module Documentation

## Overview

The Authentication module in **Quranic-Transformation** is a custom implementation using **JWT (JSON Web Tokens)** for session management. It leverages `jose` for token handling, `bcryptjs` for password hashing, and Next.js Middleware for route protection.

## Architecture

### Authentication Flow

1.  **Registration**: User submits details -> Password hashed -> User created -> Verification token generated -> Email sent.
2.  **Login**: User submits credentials -> Password verified (bcrypt) -> JWT generated (jose) -> HTTP-Only Cookie set (`session`).
3.  **Session Management**:
    - **Middleware**: Intercepts requests, decrypts the `session` cookie, and validates the user.
    - **Persistence**: Sessions are stateless (JWT) but stored in a secure, HTTP-only cookie.
    - **Expiry**: Tokens have a set expiration (default 7 days).

### Key Libraries

- **jose**: Lightweight library for signing and verifying JWTs (Edge Runtime compatible).
- **bcryptjs**: Library for hashing and comparing passwords.
- **zod**: Schema validation for API inputs.

## Key Components

### 1. Session Management (`src/lib/session.ts`)

Handles the core JWT operations.

- `encrypt(payload)`: Signs a JWT with the secret key.
- `decrypt(input)`: Verifies and decodes the JWT.
- `getSession()`: Retrieves the current session from cookies.
- `updateSession(request)`: Refreshes the session expiry on activity.

### 2. Token Management (`src/lib/tokens.ts`)

Handles auxiliary tokens for email verification and password resets.

- `generateVerificationToken(email)`: Creates a UUID token for email verification.
- `generatePasswordResetToken(email)`: Creates a UUID token for password resets.

### 3. Middleware (`src/middleware.ts`)

Protects routes based on authentication status.

- **Protected Routes**: `/dashboard`, `/profile`, `/admin`.
- **Public Routes**: `/auth/*`, `/`.
- **Logic**:
  - Redirects unauthenticated users to `/auth/login` when accessing protected routes.
  - Redirects authenticated users to `/dashboard` when accessing public auth pages (like login/register).

## Data Models

### User

The core entity for authentication.

- `email`: Unique identifier.
- `password`: Hashed password (nullable for OAuth users).
- `role`: `USER` or `ADMIN`.
- `emailVerified`: Timestamp of verification.

### VerificationToken

Used for email verification.

- `token`: Unique UUID.
- `email`: Linked user email.
- `expires`: Expiration timestamp (1 hour).

### PasswordResetToken

Used for password recovery.

- `token`: Unique UUID.
- `email`: Linked user email.
- `expires`: Expiration timestamp (1 hour).

## API Endpoints (`src/app/api/auth`)

| Endpoint                    | Method     | Description                                                      |
| :-------------------------- | :--------- | :--------------------------------------------------------------- |
| `/api/auth/register`        | `POST`     | Registers a new user, hashes password, sends verification email. |
| `/api/auth/login`           | `POST`     | Authenticates user, sets session cookie.                         |
| `/api/auth/logout`          | `POST`     | Clears the session cookie.                                       |
| `/api/auth/verify-email`    | `GET/POST` | Verifies user email using a token.                               |
| `/api/auth/resend`          | `POST`     | Resends the verification email.                                  |
| `/api/auth/forgot-password` | `POST`     | Initiates password reset flow.                                   |
| `/api/auth/reset-password`  | `POST`     | Resets password using a valid token.                             |
| `/api/auth/google`          | `GET`      | Initiates Google OAuth flow.                                     |
| `/api/auth/github`          | `GET`      | Initiates GitHub OAuth flow.                                     |

## Frontend Implementation

The frontend is built with **React** and **Tailwind CSS**, utilizing a shared layout for a consistent, premium look.

### Shared Layout (`src/app/auth/layout.tsx`)

- **Design**: Features a dark, glassmorphism aesthetic with an ambient emerald glow.
- **Functionality**: Centers content and handles responsive positioning.
- **Usage**: Wraps all pages in the `src/app/auth` directory.

### Pages

| Page Route              | Description        | Features                                                           |
| :---------------------- | :----------------- | :----------------------------------------------------------------- |
| `/auth/login`           | User Login         | Email/Password form, Social Login buttons, "Forgot Password" link. |
| `/auth/register`        | User Registration  | Name/Email/Password form, Social Login buttons, Input validation.  |
| `/auth/forgot-password` | Password Recovery  | Email input to request reset link.                                 |
| `/auth/reset-password`  | Password Reset     | New password form, validates token from URL.                       |
| `/auth/verify-email`    | Email Verification | Auto-verifies token from URL, shows success/error status.          |

### UX Features

- **Loading States**: All forms show loading spinners (`Loader2` from Lucide) during API requests.
- **Error Handling**: Displays descriptive error messages using `Alert` components.
- **Success Feedback**: Visual confirmation (Green checkmarks) upon successful actions.
- **Responsiveness**: Fully optimized for mobile, tablet, and desktop screens.
