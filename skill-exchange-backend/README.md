# Campus Skill Exchange - Backend

REST API for the "students teach students" platform, built directly from the ER model
(STUDENT, SKILL, SKILL_OFFERED, SKILL_WANTED, EXCHANGE, SESSION, FEEDBACK).

- **Runtime:** Node.js 22.13 or newer (check with `node --version`)
- **Database:** SQLite (built into Node, file `skillexchange.db`)
- **Dependencies:** none, so there is no `npm install`

## Run it

```bash
npm run seed    # creates tables from schema.sql + loads sample data (resets the DB)
npm start       # API on http://localhost:3000
npm test        # in a second terminal: runs 36 endpoint checks
```

Sample logins (all passwords `password123`): `aarav@campus.edu`, `diya@campus.edu`, `rohan@campus.edu`, `sneha@campus.edu`, `kabir@campus.edu`.

## Files

| File | Purpose |
|---|---|
| `schema.sql` | CREATE TABLE statements: PKs, FKs, CHECKs, UNIQUEs, indexes |
| `seed.js` | Runs the schema and inserts sample students, skills, exchanges |
| `db.js` | Database connection and password hashing |
| `server.js` | All API endpoints |
| `queries.sql` | Demo SQL queries (joins, GROUP BY/HAVING, subqueries, view) for the viva |
| `test.js` | Endpoint smoke tests |

## Endpoints

| Method | Path | What it does |
|---|---|---|
| POST | `/api/register` | `{name,email,password,hostelBlock?,roomNo?}` |
| POST | `/api/login` | `{email,password}` returns the student |
| GET | `/api/students`, `/api/students/:id` | List / profile with offered + wanted skills |
| GET, POST | `/api/skills` | List (`?category=`) / add `{skillName,category?}` |
| GET, POST | `/api/students/:id/offered` | Skills they teach / add `{skillId,level?}` |
| DELETE | `/api/students/:id/offered/:skillId` | Remove |
| GET, POST | `/api/students/:id/wanted` | Skills they want / add `{skillId,level?}` |
| DELETE | `/api/students/:id/wanted/:skillId` | Remove |
| GET | `/api/students/:id/matches` | Teachers for skills I want (mutual swaps and same-hostel first) |
| POST | `/api/exchanges` | `{teacherId,learnerId,skillId}` request a match |
| GET | `/api/exchanges` | `?studentId=&status=` |
| GET | `/api/exchanges/:id` | One exchange |
| PATCH | `/api/exchanges/:id/status` | `{status}` Pending to Accepted/Rejected/Cancelled, Accepted to Completed/Cancelled |
| GET, POST | `/api/exchanges/:id/sessions` | `{sessionDate,mode?,location?}` (accepted exchanges only) |
| GET, POST | `/api/exchanges/:id/feedback` | `{givenBy,rating(1-5),comments?}` (completed only, once per person) |
| GET | `/api/reports/top-teachers` | Average rating per teacher |
| GET | `/api/reports/popular-skills` | Teachers vs learners vs exchanges per skill |
| GET | `/api/reports/exchange-summary` | Count of exchanges by status |

Errors come back as `{ "error": "message" }` with status 400 / 401 / 403 / 404 / 409.

## Business rules enforced

- A teacher can only be requested for a skill they actually offer.
- Teacher and learner must be different students (also a CHECK in the table).
- No duplicate open (Pending/Accepted) exchange for the same pair and skill.
- Status can only move forward along the allowed transitions.
- Sessions only for Accepted/Completed exchanges; feedback only for Completed ones.
- Only the teacher or learner can review an exchange, once each, with a rating of 1 to 5.
- Passwords are stored as salted scrypt hashes and never returned by the API.

## Connecting your Google AI Studio frontend

CORS is already open, so the frontend can call the API directly:

```js
const API = 'http://localhost:3000/api';
const matches = await fetch(`${API}/students/1/matches`).then(r => r.json());
await fetch(`${API}/exchanges`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ teacherId: 2, learnerId: 1, skillId: 2 }),
});
```

A frontend that runs in the browser reaches `localhost` only on the same computer. To demo it from
another device, deploy the backend (for example Render or Railway) and use that URL as `API`.

## Notes and next steps

- Login returns the student but no token; the frontend keeps the `StudentID`. For a stricter
  version, add JWT sessions.
- To move to MySQL or PostgreSQL later, `schema.sql` only needs small changes
  (`AUTOINCREMENT` becomes `AUTO_INCREMENT` or `SERIAL`, `date('now')` becomes `CURRENT_DATE`).
