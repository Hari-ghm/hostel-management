# 🏠 HostelDesk — Complaint Management System

A clean, minimal hostel complaint tracker. Express backend + React (Vite) frontend.

---

## Quick Start

### 1. Install dependencies
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Run everything together
```bash
npm run dev
```
This runs `dev.sh` which starts both processes and kills both on Ctrl+C.

- API  → http://localhost:4000
- App  → http://localhost:5173

### Or run separately
```bash
npm run dev:server   # Express on :4000
npm run dev:client   # Vite on :5173
```

---

## Project Structure

```
hostel-cms/
├── dev.sh                 ← Runs both server + client (Ctrl+C stops both)
├── server/
│   ├── index.js           ← Express API (swap in-memory store for a real DB here)
│   └── package.json
└── client/
    ├── src/
    │   ├── api.js          ← All API calls in one place
    │   ├── utils.js        ← Colors, icons, formatters — easy to extend
    │   ├── App.jsx         ← View router / state shell
    │   └── components/
    │       ├── StatsBar        ← Summary counts
    │       ├── FilterBar       ← Status / category / priority filters
    │       ├── ComplaintList   ← Card list view
    │       ├── ComplaintForm   ← New complaint form
    │       └── ComplaintDetail ← Edit status, priority, delete
    └── package.json
```

---

## API Endpoints

| Method | Path                | Description                    |
|--------|---------------------|--------------------------------|
| GET    | /api/complaints     | List all (filter via query)    |
| GET    | /api/complaints/:id | Single complaint               |
| POST   | /api/complaints     | Create new                     |
| PATCH  | /api/complaints/:id | Update status / priority / etc |
| DELETE | /api/complaints/:id | Delete                         |
| GET    | /api/stats          | Counts by status & category    |

---

## Easy Extension Points

- **Add a DB** — Replace the `complaints` array in `server/index.js` with SQLite/Postgres/Mongo
- **Add categories** — Edit the `CATEGORIES` array in `FilterBar.jsx` + `utils.js`
- **Add auth** — Drop JWT middleware in `server/index.js`
- **Add notifications** — Hook into the POST route to email/SMS wardens
- **Add comments** — New `/api/complaints/:id/comments` endpoint + UI in `ComplaintDetail`

---

## Data Model

```js
{
  id:          string (uuid),
  studentName: string,
  roomNumber:  string,
  category:    'maintenance' | 'food' | 'wifi' | 'cleanliness' | 'security' | 'other',
  title:       string,
  description: string,
  priority:    'low' | 'medium' | 'high',
  status:      'open' | 'in-progress' | 'resolved',
  createdAt:   ISO string,
  updatedAt:   ISO string,
}
```
