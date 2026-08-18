# Alkira Take-Home Exercise: Login + MFA 

## Summary

A small React app covering a full sign-in path: email and password, a second step with an MFA code, then a protected page behind both.

That protected page is a table of network sites, and it's the same page for every account. What changes is what you can do on it, based on your role.

## Built with

React 19 + TypeScript on Vite, MUI for components, React Router for routing, React Hook Form + Zod for forms, Vitest + Testing Library for tests.

## Setup

```bash
npm install
```

Node 20.13 or newer.

## Run

```bash
npm run dev
```

Opens on http://localhost:5173.

## Testing

```bash
npm run test:run
```

## Accounts

| Email | Password | MFA code | Access |
| --- | --- | --- | --- |
| reader@alkira.dev | Password123! | 123456 | view only |
| editor@alkira.dev | Password123! | 654321 | add / edit / delete |

## Walking the flow

Start at `/login`. Submitting an empty form shows field errors; a wrong password shows one generic message so the form never reveals whether the email exists.

A valid password takes you to `/mfa`. A wrong code keeps you there with an error. The right code lands you on `/app`.

Sign in as the reader to see the view-only version: a Viewer chip, a notice, and no way to change anything. Sign out and come back as the editor to get Add, Edit, and Delete. Delete asks to confirm first.

Typing `/app` or `/mfa` in the URL while logged out sends you back to login. So does refreshing mid-MFA.

## Design decisions

The session lives in one `AuthProvider`, and credential checks live in `authService`. Pages call `useAuth()` and never import the mock user list, so swapping in a real API later means rewriting one file.

Auth status is `anonymous | mfaPending | authenticated` rather than a boolean, because passing the password is not the same as being signed in. The route guards read that status directly.

The mock user list holds passwords and MFA codes, but the signed-in user does not. `authService` copies over only the id, email, name, and role, so a password never ends up in the session or in `sessionStorage`.

Permissions go through `can()` and a `Protect` wrapper instead of scattering `user.role === 'readwrite'` across buttons. Write actions are hidden rather than disabled, since a disabled button on a read-only account is just clutter.

Session state is in `sessionStorage`, so a refresh keeps you signed in but closing the tab does not.

Zod schemas only check format. Whether an account actually exists is the service's job.

## Assumptions

Two mock users are enough to show both roles. MFA codes are fixed per user, with no expiry or resend. Signup validates input and then tells you account creation is off, since the requirements said full registration was not required. The sites in the table are made-up demo data, not real Alkira resources.

## Known limitations

There is no backend, so access control is UI only. Anyone can edit the app state in devtools; a real version would enforce roles server side.

No account lockout, rate limiting, or password reset. MFA codes are static rather than real TOTP or emailed codes.

Table edits live in React state, so a refresh resets them. The table has no sorting, filtering, or pagination.

Vite 6 is pinned because Vite 8 would not start on Node 20.13.
