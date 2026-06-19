# SortMyScene Backend — Complete File Structure

## 📁 Directory Organization

```
sortmyscene-backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── User.js               # User schema with password hashing
│   ├── Event.js              # Event schema
│   ├── Seat.js               # Seat schema (part of seat grid)
│   └── Reservation.js        # Reservation schema with TTL index
├── routes/
│   ├── auth.js               # POST /auth/register, /auth/login, GET /auth/me
│   ├── events.js             # GET /api/events, GET /api/events/:id
│   ├── reserve.js            # POST /api/reserve (atomic reservation)
│   └── bookings.js           # POST /api/bookings, GET /api/bookings/my
├── server.js                 # Express app setup & route mounting
├── seed.js                   # Database seeding with sample events
├── package.json              # Dependencies and scripts
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
├── README.md                 # Complete documentation (setup, API, design)
└── API-TESTING.md            # Step-by-step API testing guide
```

---

## 📄 File Descriptions

### **Entry Point**

#### `server.js`
- **Purpose:** Main Express server entry point
- **Key Features:**
  - Initializes Express app
  - Sets up CORS, JSON parsing middleware
  - Mounts all route handlers (`/auth`, `/events`, `/reserve`, `/bookings`)
  - Global error handler
  - 404 handler
  - Starts server on PORT (default: 5000)
- **Lines:** ~50
- **Dependencies:** express, cors, dotenv

---

### **Configuration**

#### `config/db.js`
- **Purpose:** MongoDB connection configuration
- **Key Features:**
  - Connects to MongoDB using Mongoose
  - Reads MONGO_URI from .env
  - Error handling for connection failures
- **Lines:** ~20
- **Used by:** server.js (top-level)

---

### **Database Models**

#### `models/User.js`
- **Purpose:** User account schema
- **Fields:**
  - `name` (String, required)
  - `email` (String, unique, required)
  - `password` (String, required, hashed)
  - `timestamps` (createdAt, updatedAt)
- **Key Methods:**
  - `pre('save')` hook: Hashes password with bcryptjs before saving
  - `matchPassword()`: Compares entered password with stored hash
- **Lines:** ~45
- **Security:** Uses bcryptjs for password hashing (10 salt rounds)

---

#### `models/Event.js`
- **Purpose:** Event schema
- **Fields:**
  - `name` (String, required)
  - `dateTime` (Date, required)
  - `venue` (String, required)
  - `totalSeats` (Number, required, min: 1)
  - `description` (String, optional)
  - `timestamps`
- **Indices:** None (standard fields)
- **Lines:** ~30
- **Note:** totalSeats is for reference; actual seat count comes from Seat collection

---

#### `models/Seat.js`
- **Purpose:** Individual seat schema (part of seat grid)
- **Fields:**
  - `eventId` (ObjectId, ref: Event, required, indexed)
  - `seatNumber` (String, required, e.g., "A1", "B5")
  - `status` (Enum: "available", "reserved", "booked")
  - `timestamps`
- **Indices:**
  - `{ eventId: 1, seatNumber: 1 }` (unique compound) — ensures one seat per event
  - `{ eventId: 1 }` — fast queries by event
  - `{ status: 1 }` — fast queries by status
- **Lines:** ~30
- **Critical:** Compound index prevents duplicate seats in an event

---

#### `models/Reservation.js`
- **Purpose:** Temporary reservation record (10-minute hold)
- **Fields:**
  - `userId` (ObjectId, ref: User, required, indexed)
  - `eventId` (ObjectId, ref: Event, required, indexed)
  - `seatNumbers` (Array of strings, required)
  - `expiresAt` (Date, TTL index)
  - `timestamps`
- **Indices:**
  - `{ expiresAt: 1 }` with `expireAfterSeconds: 0` (TTL) — auto-deletes expired docs
  - `{ userId: 1 }` — fast queries by user
  - `{ eventId: 1 }` — fast queries by event
- **Lines:** ~30
- **Critical:** TTL index auto-expires reservations; MongoDB deletes docs after expiry

---

### **Middleware**

#### `middleware/auth.js`
- **Purpose:** JWT authentication middleware
- **Key Features:**
  - Extracts Bearer token from Authorization header
  - Verifies token signature using JWT_SECRET
  - Attaches verified user object to `req.user`
  - Returns 401 if token is missing, invalid, or expired
- **Usage:** Applied to protected routes (`/bookings`, `/reserve`, `/auth/me`, etc.)
- **Lines:** ~35
- **Dependencies:** jsonwebtoken, User model

---

### **API Routes**

#### `routes/auth.js`
- **Purpose:** User authentication endpoints
- **Endpoints:**
  1. **POST /auth/register**
     - Input: name, email, password
     - Output: User object + JWT token
     - Validation: Email uniqueness, password length
     - Response codes: 201 (success), 400 (validation), 409 (duplicate email)
  
  2. **POST /auth/login**
     - Input: email, password
     - Output: User object + JWT token
     - Validation: Email/password match
     - Response codes: 200 (success), 401 (invalid), 400 (missing fields)
  
  3. **GET /auth/me** (Protected)
     - Output: Current logged-in user
     - Requires: Valid Bearer token
     - Response: User object (name, email, _id)
- **Lines:** ~80
- **Dependencies:** jsonwebtoken, bcryptjs, User model

---

#### `routes/events.js`
- **Purpose:** Event listing and detail endpoints
- **Endpoints:**
  1. **GET /events**
     - Output: Array of all events with seat summaries
     - Includes: available, reserved, booked seat counts for each event
     - Sorting: By dateTime (ascending)
     - No auth required
  
  2. **GET /events/:id**
     - Input: Event ID
     - Output: Event details + full seat grid (sorted by seatNumber)
     - Includes: All seats with status
     - Response codes: 200 (success), 400 (invalid ID), 404 (not found)
- **Lines:** ~60
- **Dependencies:** Mongoose, Event, Seat models

---

#### `routes/reserve.js`
- **Purpose:** Atomic seat reservation (prevents double-booking)
- **Endpoints:**
  1. **POST /reserve** (Protected)
     - Input: eventId, seatNumbers (array)
     - Output: Reservation object + expiresAt timestamp
     - **Atomic process:**
       - Start MongoDB transaction
       - Verify event exists
       - Check all requested seats are "available"
       - Atomically flip seats from "available" → "reserved"
       - Create Reservation document
       - Commit transaction (or rollback on failure)
     - **Double-booking prevention:**
       - If any seat is not available or becomes unavailable during update, return 409
       - Update count validation ensures race conditions are caught
     - Response codes: 201 (success), 400 (invalid input), 404 (event not found), 409 (unavailable seats)
     - Duration: 10 minutes (600 seconds)
- **Lines:** ~90
- **Key Features:**
  - MongoDB session-based transactions
  - Deduplicates seat numbers
  - Returns list of unavailable seats in error response
  - Prevents race conditions via atomic updates
- **Dependencies:** Mongoose, Seat, Reservation, Event models, auth middleware

---

#### `routes/bookings.js`
- **Purpose:** Confirm reservations and mark seats as booked
- **Endpoints:**
  1. **POST /bookings** (Protected)
     - Input: reservationId
     - Output: Booking confirmation object
     - **Atomic process:**
       - Start MongoDB transaction
       - Fetch reservation
       - Verify ownership (userId check)
       - Check expiry (if expired, revert seats to "available")
       - Atomically flip seats from "reserved" → "booked"
       - Delete Reservation document
       - Commit transaction
     - Response codes: 200 (success), 400 (invalid input), 403 (unauthorized), 404 (not found), 410 (expired)
  
  2. **GET /bookings/my** (Protected)
     - Output: User's active reservations (with populated event details)
     - Sorted by createdAt (descending — newest first)
     - Response: Array of active reservations
- **Lines:** ~100
- **Key Features:**
  - Ownership verification prevents users from confirming others' reservations
  - Expiry check + automatic seat release for expired reservations
  - Atomic updates ensure no partial bookings
- **Dependencies:** Mongoose, Seat, Reservation, auth middleware

---

### **Utilities & Setup**

#### `seed.js`
- **Purpose:** Database seeding script (run once to populate sample data)
- **Key Features:**
  - Creates 3 sample events:
    1. Coldplay: Music of the Spheres (30 seats)
    2. Sunburn Festival (20 seats)
    3. Mumbai Film Festival (15 seats)
  - Generates seat grids using `generateSeats()` function
    - Row labels: A, B, C... (letters)
    - Column numbers: 1–10 (numeric)
    - Example: A1, A2, B1, B5, C10
  - Clears existing data before seeding
- **Usage:** `npm run seed`
- **Lines:** ~70
- **Note:** Run this once after connecting MongoDB

---

#### `package.json`
- **Purpose:** NPM dependencies and scripts
- **Scripts:**
  - `npm start` — Run in production mode
  - `npm run dev` — Run with nodemon (auto-reload on file changes)
  - `npm run seed` — Populate database
- **Dependencies:**
  - `express` (v4.18.2) — Web framework
  - `mongoose` (v7.0.3) — MongoDB ODM
  - `jsonwebtoken` (v9.0.0) — JWT token generation & verification
  - `bcryptjs` (v2.4.3) — Password hashing
  - `cors` (v2.8.5) — CORS middleware
  - `dotenv` (v16.0.3) — Environment variable loading
- **Dev Dependencies:**
  - `nodemon` (v2.0.22) — Auto-restart on file changes
- **Lines:** ~30

---

#### `.env.example`
- **Purpose:** Environment variables template
- **Variables:**
  - `MONGO_URI` — MongoDB connection string
  - `JWT_SECRET` — Secret key for signing JWTs
  - `JWT_EXPIRES_IN` — Token expiry duration (default: 7d)
  - `PORT` — Server port (default: 5000)
  - `NODE_ENV` — Environment (development/production)
  - `CLIENT_URL` — Frontend URL for CORS (default: http://localhost:5173)
- **Usage:** Copy to `.env` and fill in values
- **Lines:** ~10

---

#### `.gitignore`
- **Purpose:** Specifies files/folders to exclude from Git
- **Excludes:**
  - `node_modules/` — Dependencies
  - `.env` — Sensitive env variables
  - `*.log` — Log files
  - `.vscode/`, `.idea/` — IDE config
  - `.DS_Store`, `Thumbs.db` — OS files
- **Lines:** ~25

---

### **Documentation**

#### `README.md`
- **Purpose:** Comprehensive project documentation
- **Sections:**
  1. Project overview
  2. Tech stack
  3. Installation & setup (step-by-step)
  4. Running the server
  5. Complete API documentation (all endpoints with examples)
  6. Database schema (collections, fields, indices)
  7. Design decisions (transactions, TTL, JWT, etc.)
  8. Key constraints & solutions (double-booking, expiry, race conditions)
  9. Error handling strategies
  10. Assumptions (MongoDB replica set, auth flow, TTL duration, etc.)
  11. Deployment notes
- **Lines:** ~600
- **Audience:** Developers setting up, testing, or deploying the backend

---

#### `API-TESTING.md`
- **Purpose:** Step-by-step API testing guide with cURL examples
- **Sections:**
  1. Prerequisites
  2. Complete flow (register → list events → reserve → book)
  3. All endpoint examples with expected responses
  4. Error scenarios (invalid token, missing fields, race conditions)
  5. Concurrency testing (double-booking prevention)
  6. Expiry testing
  7. Postman collection JSON
  8. Tips for testing with tools
  9. Debugging & monitoring with MongoDB
- **Lines:** ~400
- **Audience:** QA engineers, testers, developers validating the API

---

## 🔑 Key Design Patterns

### 1. **MongoDB Transactions for Atomicity**
- Used in `/api/reserve` and `/api/bookings`
- Ensures seat status changes are atomic (no partial updates)
- Prevents race conditions in concurrent requests

### 2. **TTL Indices for Auto-Expiry**
- Reservation document includes `expiresAt` with TTL index
- MongoDB automatically deletes expired reservations
- Before confirming a booking, check expiry manually to clean up associated seats

### 3. **Middleware for Authentication**
- `protect` middleware extracted to separate file
- Reusable across all protected routes
- Centralized JWT verification

### 4. **Error Handling with Try-Catch**
- All async route handlers wrapped in try-catch
- Consistent error response format
- Global error handler in server.js

### 5. **Validation at Schema Level**
- Mongoose schema defines validation rules (required, unique, enum, min, etc.)
- Prevents invalid data from entering database
- Error messages extracted and returned to client

---

## 🧪 Testing the Implementation

### Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure .env:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Seed database:**
   ```bash
   npm run seed
   ```

4. **Start server:**
   ```bash
   npm run dev
   ```

5. **Test endpoints** using cURL or Postman (see `API-TESTING.md`)

---

## 📊 File Statistics

| Category | Count | Total Lines |
|----------|-------|-------------|
| Models | 4 | ~130 |
| Routes | 4 | ~330 |
| Middleware | 1 | ~35 |
| Config | 1 | ~20 |
| Main Server | 1 | ~50 |
| Utilities (Seed, Env, Gitignore) | 3 | ~85 |
| Documentation (README, API-TESTING) | 2 | ~1000 |
| **TOTAL** | **16** | **~1650** |

---

## ✅ Checklist for Deployment

- [ ] Fill in `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use a MongoDB replica set (required for transactions)
- [ ] Update `CLIENT_URL` in `.env` to match frontend domain
- [ ] Change `JWT_SECRET` to a long, random string
- [ ] Test all endpoints in production environment
- [ ] Set up monitoring & logging
- [ ] Enable HTTPS on frontend & ensure CORS allows it

---

**Created with ❤️ for SortMyScene**
