# Pizza Delivery Full-Stack Application

A full-stack pizza ordering and inventory management platform built for the **Oasis Infobyte Web Development Internship — Level 3**. Customers build their own pizza from a live ingredient inventory, pay via Razorpay (test mode), and track their order status in real time. Admins manage stock and fulfil orders through a dedicated admin flow.

## Tech Stack

- **Frontend:** React (Vite) *(in progress)*
- **Backend:** Node.js, Express 5
- **Database:** MongoDB (Mongoose 9), hosted on MongoDB Atlas
- **Real-time:** Socket.io
- **Auth:** JWT, bcrypt
- **Email:** Nodemailer (Gmail)
- **Payments:** Razorpay (test mode)
- **Scheduled jobs:** node-cron

## Project Status

**Backend: complete and tested.**
**Frontend: completed.**

## Features

### Auth
- Registration with real email verification (Nodemailer)
- Login with JWT-based authorization
- Forgot / reset password flow via emailed reset link
- Role-based access control (user / admin)

### Ordering (Build-Your-Own Pizza)
- Customers select a base, sauce, cheese, and any number of vegetables from live Inventory
- Price calculated server-side from the selected ingredients — never trusted from the client
- Stock automatically decremented across all selected ingredients on order creation
- Order rejected (with no partial stock changes) if any selected ingredient is out of stock

### Inventory Management
- Categorized ingredients (base / sauce / cheese / vegetable), each with stock, price, and a configurable low-stock threshold
- Admin-only manual stock updates
- Automated low-stock alerts via a scheduled node-cron job

### Payments
- Razorpay order creation (test mode)
- Payment verification via HMAC signature validation — payments are never trusted without cryptographic proof

### Real-Time Order Tracking
- Socket.io with per-user rooms
- Order status updates (`Order Received → In Kitchen → Sent to Delivery → Delivered`) pushed live to the customer the instant an admin updates them — no polling or refresh required

### Admin Controls
- Role-protected routes (`isAdmin` middleware)
- Order status management
- Inventory oversight

## Project Structure
backend/
config/ # DB and Razorpay connection setup
models/ # Mongoose schemas: User, Inventory, Order
controllers/ # Route logic
routes/ # Express route definitions
middleware/ # JWT auth and role-based access control
jobs/ # node-cron low-stock alert job
utils/ # Email sending, token generation, Socket.io instance sharing
seed.js # One-time script to populate realistic inventory data
server.js
frontend/
src/
pages/ # Route-level components
components/ # Shared components (ProtectedRoute)
context/ # AuthContext (shared login state)
services/ # api.js (axios), socket.js (Socket.io client)

## Getting Started

### Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

Seed realistic inventory data (safe to re-run — skips items that already exist):
```bash
node seed.js
```

Run the server:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`.

## Notes

- Both servers (backend on :5000, frontend on :5173) must be running simultaneously for the app to work.
- Razorpay is running in **test mode** — use Razorpay's official domestic Indian test card numbers to complete a payment.
- If you encounter a CORS error on PATCH/DELETE requests in your browser, try an incognito window — some browser extensions are known to interfere with non-GET/POST requests during local development.

## Author

Built by Jonathan Mkpuma as part of the OIBSIP Level 3 Web Development internship.
