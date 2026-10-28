# StaffSync – Modern Human Resource Management Solution (MERN)

Stack: MongoDB · Express.js · React (Vite) · Node.js · JWT · Bootstrap
Roles: **admin**, **manager**, **employee**

Features: JWT authentication, role-based access, employee management (CRUD),
leave apply/approve, attendance check-in/out, announcements, training programs.

## Requirements
Node.js v16+, npm v8+, MongoDB (local or Atlas), Chrome/Firefox, VS Code, Postman (optional).

## Setup
```bash
# 1) Backend
cd backend
cp .env.example .env        # set MONGO_URI and JWT_SECRET
npm install
npm run seed                # demo users (see below)
npm run dev                 # http://localhost:5000

# 2) Frontend (new terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

Demo logins (after `npm run seed`):
- admin@staffsync.com / Admin@123
- manager@staffsync.com / Manager@123
- employee@staffsync.com / Employee@123

(Without seeding, the first person to register becomes admin.)

## Structure (MVC)
```
backend/   config/ middleware/ models/ controllers/ routes/ server.js seed.js
frontend/  src/{pages, components, api.js, AuthContext.jsx, App.jsx}
```

## ER overview
User (1)──(n) Leave · User (1)──(n) Attendance · User (1)──(n) Announcement(postedBy) · Training (n)──(n) User (enrolled)

## API (prefix /api)
| Route | Access |
|---|---|
| POST /auth/register, /auth/login · GET /auth/me | public / any user |
| GET, POST /employees · GET, PUT, DELETE /employees/:id | read: admin+manager, write: admin |
| POST /leaves · GET /leaves/my · GET /leaves · PUT /leaves/:id/status | apply: all, review: manager+admin |
| POST /attendance/checkin · PUT /attendance/checkout · GET /attendance/my · GET /attendance | all / manager+admin |
| GET, POST, DELETE /announcements | read: all, write: manager+admin |
| GET, POST, DELETE /training · POST /training/:id/enroll | read+enroll: all, write: manager+admin |

## User flow
Login → Dashboard → Employee: apply leave, check in/out, view announcements, enroll in training
→ Manager: approve/reject leaves, post announcements, create training
→ Admin: manage employees and roles.
