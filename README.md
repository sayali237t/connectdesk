# ConnectDesk

Lightweight contact & relationship manager: contacts, interaction timelines, notes and follow-ups.

- Live: https://connectdesk-theta.vercel.app/
- Source: https://github.com/sayali237t/connectdesk
- Full docs: [DOCUMENTATION.md](DOCUMENTATION.md)

**Stack:** Next.js (App Router) · React · Tailwind CSS · Mongoose · MongoDB Atlas · Lucide icons

The frontend and the API (Next.js Route Handlers under `/api`) are one app, so there is no separate backend to deploy.

## Local setup

```bash
npm install
cp .env.example .env.local   # then set MONGODB_URI
npm run seed                 # optional: demo data (safe to re-run)
npm run dev                  # http://localhost:3000
```

## Environment variables

| Name | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (include the database name, e.g. `/connectdesk`) |

## Deploy to Vercel

1. Push this repo to GitHub.
2. In MongoDB Atlas: **Network Access** → add `0.0.0.0/0` (Vercel uses dynamic IPs). Ensure your database user has read/write access.
3. In Vercel: **Add New → Project**, import the repo (framework is auto-detected as Next.js).
4. Under **Environment Variables**, add `MONGODB_URI`.
5. Click **Deploy**.
6. Optional: seed the production DB by running `npm run seed` locally with the production URI in `.env.local`.

## API

`/api/contacts`, `/api/contacts/[id]`, `/api/interactions`, `/api/interactions/[id]`, `/api/dashboard`
