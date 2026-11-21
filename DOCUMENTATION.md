# ConnectDesk — Project Documentation

Lightweight contact & relationship management system for a single user: store contacts, track interactions, keep notes and manage follow-ups.

| | |
| --- | --- |
| **Live app** | https://connectdesk-theta.vercel.app/ |
| **Source code** | https://github.com/sayali237t/connectdesk |
| **Version** | 1.0 |

## 1. Overview

ConnectDesk answers three questions:

1. Who are my contacts?
2. What interactions have I had with a particular contact?
3. Which contacts require a follow-up?

The app has three sections (Dashboard, Contacts, Activities) plus an individual contact profile with an interaction timeline. There is no authentication; it is a single-user app.

## 2. Tech stack

| Layer | Technology |
| --- | --- |
| Framework (UI + API) | Next.js 14 (App Router, Route Handlers) |
| UI | React 18, Tailwind CSS, Lucide React icons |
| Database | MongoDB Atlas |
| ORM / validation | Mongoose |
| Hosting | Vercel |

There is no separate backend. The API runs as Next.js Route Handlers (serverless functions on Vercel).

```
User → Next.js frontend → Next.js API routes (/api) → Mongoose models → MongoDB Atlas
```

## 3. Features

### Dashboard (`/`)
- Stats: total contacts, total interactions, upcoming follow-ups.
- Follow-ups list showing contact name, interaction title and follow-up date. Overdue items are shown in red, upcoming in green.
- Recent contacts (by creation date) and recent activities (by interaction date).
- Quick Add button to create a contact.
- Clicking any contact, activity or follow-up opens that contact's profile.

### Contacts (`/contacts`)
- Add, edit, delete and list contacts.
- Search by name, email or phone (case-insensitive).
- Filter by vertical (free text) and contact type (Student, Client, Candidate, Professional, Other).

### Contact profile (`/contacts/[id]`)
- Contact details: name, email, phone, vertical, type, description, date added; edit and delete actions.
- Interaction timeline, newest first, showing type, title, date/time, notes and follow-up date.
- Add, edit and delete interactions in a modal, without leaving the page.

### Activities (`/activities`)
- All interactions across contacts.
- Filter by type (Call, Meeting, Interview, Email, General Note), sort newest or oldest first.
- "Only with follow-ups" toggle for upcoming and overdue follow-ups.

## 4. Data model

### `contacts`
| Field | Type | Required |
| --- | --- | --- |
| `_id` | ObjectId | Auto |
| `name` | String | Yes |
| `email` | String | No (format validated) |
| `phone` | String | No |
| `vertical` | String | No |
| `contactType` | String | No (predefined list) |
| `description` | String | No |
| `createdAt`, `updatedAt` | Date | Auto |

Company and designation are intentionally excluded.

### `interactions`
| Field | Type | Required |
| --- | --- | --- |
| `_id` | ObjectId | Auto |
| `contactId` | ObjectId (ref Contact) | Yes |
| `type` | String (Call, Meeting, Interview, Email, General Note) | Yes |
| `title` | String | Yes |
| `notes` | String | No |
| `date` | Date | Yes |
| `followUpDate` | Date | No |
| `createdAt`, `updatedAt` | Date | Auto |

Follow-up dates belong to interactions, not contacts, so each call or meeting can have its own follow-up and upcoming follow-ups are derived automatically.

### Data integrity rules
- An interaction must reference an existing contact (checked on create); `contactId` cannot be changed afterwards.
- Deleting a contact also deletes its interactions.
- Deleting an interaction does not affect its contact.
- Updating a contact does not alter its interaction history.
- Invalid MongoDB IDs return `400`; missing records return `404`.

## 5. API reference

Base URL: `/api` (for example `https://connectdesk-theta.vercel.app/api/contacts`).

### Contacts
| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/contacts` | List contacts. Query: `search`, `vertical`, `contactType` |
| POST | `/contacts` | Create contact |
| GET | `/contacts/[id]` | Get one contact |
| PUT | `/contacts/[id]` | Update contact |
| DELETE | `/contacts/[id]` | Delete contact and its interactions |

### Interactions
| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/interactions` | List interactions. Query: `contactId`, `type`, `sort` (`asc` or `desc`, default `desc`) |
| POST | `/interactions` | Create interaction |
| GET | `/interactions/[id]` | Get one interaction |
| PUT | `/interactions/[id]` | Update interaction |
| DELETE | `/interactions/[id]` | Delete interaction |

### Dashboard
| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/dashboard` | Statistics and recent data |

Response shape:
```json
{
  "totalContacts": 0,
  "totalInteractions": 0,
  "upcomingFollowUps": 0,
  "recentContacts": [],
  "recentActivities": [],
  "followUps": []
}
```

Errors are returned as `{ "error": "message" }` with status `400` (validation or bad ID), `404` (not found) or `500`.

## 6. Project structure

```
connectdesk/
├── scripts/seed.mjs          # idempotent demo data seeding
├── src/
│   ├── app/
│   │   ├── layout.js, page.js, globals.css
│   │   ├── contacts/page.js, contacts/[id]/page.js
│   │   ├── activities/page.js
│   │   └── api/ (contacts, interactions, dashboard route handlers)
│   ├── components/ (layout, dashboard, contacts, interactions, ui.js)
│   ├── lib/ (mongodb.js connection cache, utils.js helpers)
│   └── models/ (Contact.js, Interaction.js)
├── .env.example
└── package.json
```

## 7. Local setup

```bash
git clone https://github.com/sayali237t/connectdesk.git
cd connectdesk
npm install
cp .env.example .env.local     # set MONGODB_URI
npm run seed                   # optional demo data
npm run dev                    # http://localhost:3000
```

| Variable | Description |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string, including the database name |

Credentials live only in environment variables; `.env.local` is gitignored.

### Seed script
`npm run seed` upserts six event-industry demo contacts and eight interactions (including upcoming and overdue follow-ups). It is safe to re-run and only removes stale interactions belonging to the seeded contacts.

## 8. Deployment (Vercel)

1. Push the repo to GitHub.
2. In MongoDB Atlas, allow `0.0.0.0/0` under Network Access.
3. Import the repo in Vercel (Next.js is auto-detected).
4. Add the `MONGODB_URI` environment variable.
5. Deploy. Production: https://connectdesk-theta.vercel.app/

## 9. Non-functional requirements

Responsive layout (sidebar collapses to a top bar on mobile), form validation (client and server), API error handling with on-screen messages, loading spinners, empty states, delete confirmations, consistent date formatting, and persistent MongoDB storage.

## 10. Out of scope (v1.0)

Authentication, multiple users, company/designation fields, Gmail, AI and WhatsApp integrations, voice notes, automated reminders, charts and analytics, CSV import/export, role management.
