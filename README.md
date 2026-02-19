# Vyride

Vyride is a small demo web app for verifying taxi/cab drivers and submitting passenger reports. It is built with React + Vite + TypeScript and uses Tailwind CSS for styling. The repo contains UI components, example pages, and mock data to demonstrate core flows (verify, report, admin review, passenger account).

## Features

- Verify driver by plate number or driver ID (demo UI)
- Submit passenger reports and view admin responses (using mock data)
- Admin dashboard with metrics and recent reports (demo)
- Passenger registration and account pages (demo flows)
- Simple email/password demo login

## Quick start

Requirements: Node.js 18+ and npm.

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open: http://localhost:8080/

Build for production:

```bash
npm run build
```

Run typecheck:

```bash
npx tsc --noEmit
```

Run tests:

```bash
npm test
```

## Important routes / pages

- Home / Verify: [src/pages/Index.tsx](src/pages/Index.tsx)
- Login (demo): [src/pages/Login.tsx](src/pages/Login.tsx)
- Passenger Register: [src/pages/PassengerRegister.tsx](src/pages/PassengerRegister.tsx)
- Passenger Account: [src/pages/PassengerAccount.tsx](src/pages/PassengerAccount.tsx)
- Admin Dashboard: [src/pages/AdminDashboard.tsx](src/pages/AdminDashboard.tsx)
- App router: [src/App.tsx](src/App.tsx)

Navigation components:
- Navbar: [src/components/Navbar.tsx](src/components/Navbar.tsx)
- Footer: [src/components/Footer.tsx](src/components/Footer.tsx)

Data & types:
- Mock data: [src/data/mockData.ts](src/data/mockData.ts)
- Domain types: [src/types/vyride.ts](src/types/vyride.ts)

## Demo credentials

Use the demo passenger credentials shown on the login page:

- Email: `passenger@vyride.demo`
- Password: `demo123`

These are for local/demo use only and are validated client-side in the demo login flow.

## Extending with real auth / backend

This project currently uses mock data located in [src/data/mockData.ts](src/data/mockData.ts). To wire a real backend:

- Replace mock data and API calls with real endpoints (REST/GraphQL).
- Add authentication (Firebase Auth, Auth0, or custom) and protect routes.
- Persist reports and admin responses in a database (Firestore, Postgres, etc.).

## Scripts

Key scripts are defined in `package.json`:

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — preview production build
- `npm test` — run unit tests with Vitest
- `npx tsc --noEmit` — run TypeScript type-check

## Contributing

1. Create a branch for your change
2. Run `npm install` and `npm run dev` to test
3. Open a PR with a short description and include any screenshots for UI changes

## Notes

- This repository is a demo and contains placeholder logic for authentication and persistence. Treat mock data as example content only.

If you want, I can also:
- Add a README section documenting how to wire Firebase Auth
- Add GitHub Actions for CI (test + typecheck)
- Create a short contributing checklist or PR template
