# SortMyScene — Event Ticket Booking Backend


## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Installation & Setup](#installation--setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Design Decisions](#design-decisions)
- [Key Constraints & Solutions](#key-constraints--solutions)
- [Error Handling](#error-handling)
- [Assumptions](#assumptions)

---

## 🎯 Project Overview

SortMyScene is a full-stack event ticketing platform that allows users to:

1. **Browse events** with live seat availability
2. **Reserve seats** for 10 minutes with atomic operations (no double-booking)
3. **Confirm bookings** and receive instant confirmation
4. **Manage their bookings** via their user dashboard

This backend enforces strict constraints to prevent race conditions, expired reservations, and overbooking.

---

## 🛠️ Tech Stack

| Layer         | Technology              |
| ------------- | ----------------------- |
| **Runtime**   | Node.js                 |
| **Framework** | Express.js              |
| **Database**  | MongoDB + Mongoose ODM  |
| **Auth**      | JWT (Bearer tokens)     |
| **Security**  | bcryptjs (password hashing) |
| **Validation**| Mongoose schema validation |

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** ≥ 14.0
- **MongoDB** (Atlas or local instance)
- **npm** or **yarn**

### Step 1: Clone and Install

```bash
cd sortmyscene-backend
npm install
```

### Step 2: Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Example `.env`:**

```env
MONGO_URI=""
JWT_SECRET=""
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=""
```

### Step 3: Seed the Database

Populate MongoDB with sample events and seats:

```bash
npm run seed
```

This creates 3 sample events (Coldplay, Sunburn Festival, Mumbai Film Festival) with seat grids.

---

##  Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

**Health check:**
```bash
curl http://localhost:5000
```

Response:
```json
{ "status": "SortMyScene API is running " }
```

---

##  API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require a Bearer token. Include it in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

### **1. Authentication Endpoints**

#### Register User

```
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Login

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### Get Current User

```
GET /auth/me
```

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### **2. Events Endpoints**

#### List All Events

```
GET /events
```

**Response (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Coldplay: Music of the Spheres World Tour",
    "dateTime": "2025-08-15T19:30:00.000Z",
    "venue": "DY Patil Stadium, Navi Mumbai",
    "totalSeats": 30,
    "description": "Experience Coldplay live...",
    "seatSummary": {
      "available": 25,
      "reserved": 3,
      "booked": 2
    }
  }
]
```

---

#### Get Event Details with Seat Grid

```
GET /events/:id
```

**Response (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Coldplay Concert",
  "dateTime": "2025-08-15T19:30:00.000Z",
  "venue": "DY Patil Stadium",
  "totalSeats": 30,
  "seats": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "seatNumber": "A1",
      "status": "available"
    },
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
      "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "seatNumber": "A2",
      "status": "reserved"
    }
    // ... more seats
  ]
}
```

---

### **3. Reservation Endpoint**

#### Reserve Seats (10-minute hold)

```
POST /reserve
```

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Request Body:**
```json
{
  "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "seatNumbers": ["A1", "A2", "B3"]
}
```

**Response (201) — Success:**
```json
{
  "message": "Seats reserved successfully",
  "reservation": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A1", "A2", "B3"],
    "expiresAt": "2025-06-18T14:15:30.000Z"
  },
  "expiresAt": "2025-06-18T14:15:30.000Z",
  "durationSeconds": 600
}
```

**Response (409) — Seat Unavailable:**
```json
{
  "message": "One or more selected seats are no longer available",
  "unavailableSeats": ["A2"]
}
```

---

### **4. Booking Endpoint**

#### Confirm Booking (seats → "booked")

```
POST /bookings
```

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Request Body:**
```json
{
  "reservationId": "64f1a2b3c4d5e6f7g8h9i0j4"
}
```

**Response (200) — Success:**
```json
{
  "message": "Booking confirmed successfully! 🎉",
  "booking": {
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A1", "A2", "B3"],
    "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
    "bookedAt": "2025-06-18T14:10:30.000Z"
  }
}
```

**Response (410) — Reservation Expired:**
```json
{
  "message": "Reservation has expired. Seats have been released. Please reserve again."
}
```

---

#### Get User's Bookings

```
GET /bookings/my
```

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
    "eventId": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Coldplay Concert",
      "dateTime": "2025-08-15T19:30:00.000Z",
      "venue": "DY Patil Stadium"
    },
    "seatNumbers": ["A1", "A2"],
    "expiresAt": "2025-06-18T14:15:30.000Z",
    "createdAt": "2025-06-18T14:05:30.000Z"
  }
]
```

---

##  Database Schema

### Collections

#### **Users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Events**
```javascript
{
  _id: ObjectId,
  name: String,
  dateTime: Date,
  venue: String,
  totalSeats: Number,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Seats**
```javascript
{
  _id: ObjectId,
  eventId: ObjectId (ref: Event),
  seatNumber: String,            // e.g., "A1", "B5"
  status: String (enum),         // "available", "reserved", "booked"
  createdAt: Date,
  updatedAt: Date
}
```

**Indices:**
- `{ eventId: 1, seatNumber: 1 }` (unique compound)
- `{ eventId: 1 }`
- `{ status: 1 }`

#### **Reservations**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  eventId: ObjectId (ref: Event),
  seatNumbers: [String],         // e.g., ["A1", "A2"]
  expiresAt: Date,               // TTL index for auto-deletion
  createdAt: Date,
  updatedAt: Date
}
```

**Indices:**
- `{ expiresAt: 1 }` (TTL index — auto-deletes docs after expiry)
- `{ userId: 1 }`
- `{ eventId: 1 }`

---

##  Design Decisions

### 1. **Atomic Seat Reservations (Double-Booking Prevention)**

**Problem:** Race conditions where two users reserve the same seat simultaneously.

**Solution:**
- Use **MongoDB transactions** wrapped in a session.
- Query for available seats, then atomically update their status to "reserved" all within the same transaction.
- If the update count doesn't match the requested count, a race condition occurred → abort and return 409 Conflict.

**Code:** `routes/reserve.js` (lines 30-75)

```javascript
// Inside transaction:
const updateResult = await Seat.updateMany(
  { eventId, seatNumber: { $in: uniqueSeats }, status: "available" },
  { $set: { status: "reserved" } },
  { session }
);

if (updateResult.modifiedCount !== uniqueSeats.length) {
  // Race condition detected
  await session.abortTransaction();
  return res.status(409).json({ message: "Seats taken by another user" });
}
```

---

### 2. **Expiring Reservations (10-minute TTL)**

**Problem:** Users reserve seats but never complete booking, blocking them indefinitely.

**Solution:**
- Store `expiresAt` timestamp on each Reservation (10 minutes from now).
- MongoDB TTL index automatically deletes expired reservations.
- Before confirming a booking, check if the reservation has expired; if so, revert reserved seats back to available.

**Code:** `models/Reservation.js` (lines 28-30)

```javascript
expiresAt: {
  type: Date,
  index: { expireAfterSeconds: 0 }, // TTL index
}
```

---

### 3. **JWT Authentication**

**Decision:** Stateless JWT tokens instead of sessions.

**Why:**
- Scalable across multiple server instances.
- No server-side session storage needed.
- Each request is self-contained and verifiable.

**Token includes:** User ID, expires in 7 days.

**Code:** `middleware/auth.js` — `protect` middleware verifies tokens on protected routes.

---

### 4. **Atomic Booking Confirmation**

**Problem:** A seat marked as "reserved" might become unavailable (e.g., another reservation expires and releases it, or a concurrent booking grabs it).

**Solution:**
- Use the same transaction pattern in `/api/bookings`.
- Verify ownership (only the user who made the reservation can confirm it).
- Check expiry before allowing confirmation.
- Atomically flip "reserved" → "booked".

**Code:** `routes/bookings.js` (lines 25-75)

---

### 5. **Seat Number Format**

**Design:** Use alphanumeric seat numbers like `A1`, `B2`, `C3`.

**Why:**
- More intuitive for users than numeric indices.
- Supports variable grid layouts (3 rows × 10 seats, 5 rows × 15 seats, etc.).
- Generated in seed script: `generateSeats()` function.

---

### 6. **Separation of Concerns**

**Structure:**
- `models/` — Data schemas (User, Event, Seat, Reservation).
- `routes/` — API logic (auth, events, reserve, bookings).
- `middleware/` — Cross-cutting concerns (auth verification).
- `config/` — External connections (MongoDB).

This keeps the codebase maintainable and testable.

---

##  Key Constraints & Solutions

### Constraint 1: Prevent Double Booking

| Approach | Pros | Cons |
|----------|------|------|
| **MongoDB Transactions**  | Atomic, truly prevents race conditions | Requires replica set |
| Locking (Redis) | Effective | Extra infrastructure |
| Application-level mutex | Simple | Doesn't work across processes |

**Implementation:** MongoDB transactions with session-based atomicity.

---

### Constraint 2: Expired Reservations Should Not Allow Booking

| Step | Action |
|------|--------|
| 1 | User reserves seats (expiresAt = now + 10 min) |
| 2 | Reservation document created |
| 3 | TTL index waits for expiry |
| 4 | If user tries to book after expiry → check `reservation.expiresAt < new Date()` |
| 5 | If expired → release seats back to "available" and reject booking |
| 6 | TTL index auto-deletes the reservation document |

**Code:** `routes/bookings.js` (lines 55-73)

```javascript
if (reservation.expiresAt < new Date()) {
  // Revert seats to available
  await Seat.updateMany(
    { eventId: reservation.eventId, seatNumber: { $in: reservation.seatNumbers } },
    { $set: { status: "available" } },
    { session }
  );
  // Delete reservation
  await Reservation.findByIdAndDelete(reservationId, { session });
  return res.status(410).json({ message: "Reservation has expired" });
}
```

---

### Constraint 3: Handle Seat Becoming Unavailable Between Selection & Reservation

**Scenario:**
1. User selects seats A1, A2.
2. A2 is taken by another user before our POST /reserve completes.
3. Return helpful error with `unavailableSeats: ["A2"]`.

**Code:** `routes/reserve.js` (lines 58-70)

```javascript
if (seats.length !== uniqueSeats.length) {
  const unavailable = uniqueSeats.filter(sn => !foundSeatNumbers.includes(sn));
  return res.status(409).json({
    message: "One or more seats are no longer available",
    unavailableSeats: unavailable
  });
}
```

Frontend uses this to show which specific seats became unavailable.

---

## Error Handling

### Global Error Handler

All unhandled errors are caught and logged:

```javascript
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});
```

### Route-Level Error Handling

All async route handlers are wrapped in `try-catch` blocks:

```javascript
router.post("/reserve", protect, async (req, res) => {
  const session = await mongoose.startSession();
  try {
    // ... logic ...
  } catch (error) {
    await session.abortTransaction();
    console.error("Error:", error);
    res.status(500).json({ message: "Reservation failed" });
  } finally {
    session.endSession();
  }
});
```

### Validation Errors

Mongoose schema validation errors are caught and returned:

```javascript
if (error.name === "ValidationError") {
  const messages = Object.values(error.errors).map(e => e.message);
  return res.status(400).json({ message: messages.join(", ") });
}
```

---

##  Assumptions

1. **MongoDB Replica Set:**  
   Transactions require a replica set. Local MongoDB deployments or Atlas dev tier may not support this. For testing, use MongoDB Atlas (free tier supports transactions).

2. **User Authentication:**  
   Users must sign up and log in. The API uses JWTs; frontend must store and send tokens.

3. **Reservation Duration:**  
   Fixed at 10 minutes. Can be customized by changing `RESERVATION_DURATION_MS` in `routes/reserve.js`.

4. **Seat Grid Layout:**  
   Seats are generated as `<ROW><COL>` (e.g., A1, B3, C10). Row is a letter; column is 1–10.  
   Change `generateSeats()` in `seed.js` to support different layouts.

5. **Email Notifications:**  
   Not implemented in this version. Can be added with Nodemailer + background jobs (Celery/Bull).

6. **Booking Cancellation:**  
   Not implemented. Users can only confirm or let reservations expire.

7. **CORS:**  
   Configured to allow requests from `http://localhost:5173` (default Vite port). Update `CLIENT_URL` in `.env` for production.

8. **No Rate Limiting:**  
   Consider adding express-rate-limit for production.

---

##  Testing the API

### 1. Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "alice123"
  }'
```

**Save the returned `token`.**

### 2. List Events

```bash
curl http://localhost:5000/api/events
```

**Copy an event ID.**

### 3. Reserve Seats

```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "<EVENT_ID>",
    "seatNumbers": ["A1", "A2"]
  }'
```

**Save the returned `reservation._id`.**

### 4. Confirm Booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "<RESERVATION_ID>"
  }'
```

---

## 🚀 Deployment Notes

### Environment Variables (Production)

```env
MONGO_URI=mongodb+srv://prod_user:prod_password@prod-cluster.mongodb.net/sortmyscene
JWT_SECRET=your_very_long_random_secret_key_xyz123
PORT=5000
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
```

### MongoDB Replica Set

For production transactions, ensure your MongoDB is a replica set:

```javascript
// Test in MongoDB shell:
rs.status();
```

---

##  Support & Questions

For issues or questions about the backend:

1. Check the [API Documentation](#api-documentation) section.
2. Review [Design Decisions](#design-decisions) for architectural rationales.
3. Check console logs during development (`npm run dev`).

---




