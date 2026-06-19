# API Testing Guide

This guide provides complete step-by-step examples to test the SortMyScene backend API.

## Prerequisites

- Backend running on `http://localhost:5000`
- Database seeded with `npm run seed`
- REST client (Postman, Insomnia, cURL, or VS Code REST Client)

---

## Step 1: Register a User

**Endpoint:** `POST /api/auth/register`

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response (201):**
```json
{
  "message": "Account created successfully",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j0",
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjFhMmIzYzRkNWU2ZjdnOGg5aTBqMCIsImlhdCI6MTY5Mzk3NzA3NywiZXhwIjoxNjk0NTgxODc3fQ.abcdefghijklmnopqrstuvwxyz"
}
```

**👉 Save the `token` for the next requests.**

---

## Step 2: Login (Alternative to Registration)

**Endpoint:** `POST /api/auth/login`

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePass123"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j0",
    "name": "Alice Johnson",
    "email": "alice@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Step 3: Get Current User

**Endpoint:** `GET /api/auth/me`

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j0",
  "name": "Alice Johnson",
  "email": "alice@example.com"
}
```

---

## Step 4: List All Events

**Endpoint:** `GET /api/events`

```bash
curl http://localhost:5000/api/events
```

**Expected Response (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Coldplay: Music of the Spheres World Tour",
    "dateTime": "2025-08-15T19:30:00.000Z",
    "venue": "DY Patil Stadium, Navi Mumbai",
    "totalSeats": 30,
    "description": "Experience Coldplay live in Mumbai with their world-famous light show.",
    "seatSummary": {
      "available": 30,
      "reserved": 0,
      "booked": 0
    }
  },
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "name": "Sunburn Festival 2025",
    "dateTime": "2025-12-27T16:00:00.000Z",
    "venue": "Vagator Beach, Goa",
    "totalSeats": 20,
    "seatSummary": {
      "available": 20,
      "reserved": 0,
      "booked": 0
    }
  },
  // ... more events
]
```

**👉 Copy an event `_id` (e.g., `64f1a2b3c4d5e6f7g8h9i0j1`).**

---

## Step 5: Get Event Details with Seat Grid

**Endpoint:** `GET /api/events/:id`

```bash
curl http://localhost:5000/api/events/64f1a2b3c4d5e6f7g8h9i0j1
```

**Expected Response (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
  "name": "Coldplay: Music of the Spheres World Tour",
  "dateTime": "2025-08-15T19:30:00.000Z",
  "venue": "DY Patil Stadium, Navi Mumbai",
  "totalSeats": 30,
  "description": "Experience Coldplay live in Mumbai with their world-famous light show.",
  "seats": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j10",
      "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "seatNumber": "A1",
      "status": "available"
    },
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j11",
      "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "seatNumber": "A2",
      "status": "available"
    },
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j12",
      "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "seatNumber": "A3",
      "status": "available"
    }
    // ... more seats
  ]
}
```

---

## Step 6: Reserve Seats (Atomic Reservation)

**Endpoint:** `POST /api/reserve`

```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A1", "A2", "B1"]
  }'
```

**Expected Response (201):**
```json
{
  "message": "Seats reserved successfully",
  "reservation": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j20",
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A1", "A2", "B1"],
    "expiresAt": "2025-06-18T14:15:30.123Z"
  },
  "expiresAt": "2025-06-18T14:15:30.123Z",
  "durationSeconds": 600
}
```

**👉 Save the `reservation._id` for the next step.**

**⏱️ Note:** The reservation expires in 600 seconds (10 minutes).

---

## Step 7a: Confirm Booking (Success Case)

**Endpoint:** `POST /api/bookings`

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "64f1a2b3c4d5e6f7g8h9i0j20"
  }'
```

**Expected Response (200):**
```json
{
  "message": "Booking confirmed successfully! 🎉",
  "booking": {
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A1", "A2", "B1"],
    "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
    "bookedAt": "2025-06-18T14:10:30.456Z"
  }
}
```

---

## Step 7b: Try Double-Booking (Concurrency Test)

To test the double-booking prevention:

### User 1 Reserves A3, A4

```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Authorization: Bearer TOKEN_USER1" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A3", "A4"]
  }'
```

### User 2 Tries to Reserve A4 (Before User 1 Confirms)

```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Authorization: Bearer TOKEN_USER2" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": ["A4", "A5"]
  }'
```

**Expected Response (409):**
```json
{
  "message": "One or more selected seats are no longer available",
  "unavailableSeats": ["A4"]
}
```

✅ **Double-booking prevented!**

---

## Step 8: Test Expired Reservation

1. Reserve seats
2. Wait 10 minutes (or manually update `expiresAt` in MongoDB to past)
3. Try to confirm booking

```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reservationId": "EXPIRED_RESERVATION_ID"
  }'
```

**Expected Response (410):**
```json
{
  "message": "Reservation has expired. Seats have been released. Please reserve again."
}
```

---

## Step 9: Get User's Active Reservations

**Endpoint:** `GET /api/bookings/my`

```bash
curl http://localhost:5000/api/bookings/my \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Expected Response (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j20",
    "userId": "64f1a2b3c4d5e6f7g8h9i0j0",
    "eventId": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "Coldplay: Music of the Spheres World Tour",
      "dateTime": "2025-08-15T19:30:00.000Z",
      "venue": "DY Patil Stadium, Navi Mumbai"
    },
    "seatNumbers": ["A1", "A2", "B1"],
    "expiresAt": "2025-06-18T14:15:30.123Z",
    "createdAt": "2025-06-18T14:05:30.123Z"
  }
]
```

---

## Error Scenarios to Test

### Invalid Token

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token"
```

**Response (401):**
```json
{
  "message": "Not authorized, invalid token"
}
```

### Missing Token

```bash
curl http://localhost:5000/api/bookings/my
```

**Response (401):**
```json
{
  "message": "Not authorized, no token"
}
```

### Invalid Event ID

```bash
curl http://localhost:5000/api/events/invalid_id
```

**Response (400):**
```json
{
  "message": "Invalid event ID"
}
```

### Non-existent Event

```bash
curl http://localhost:5000/api/events/64f1a2b3c4d5e6f7g8h9i0j9
```

**Response (404):**
```json
{
  "message": "Event not found"
}
```

### Empty Seat Numbers

```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "seatNumbers": []
  }'
```

**Response (400):**
```json
{
  "message": "eventId and a non-empty seatNumbers array are required"
}
```

---

## Postman Collection (JSON)

You can import this into Postman as a collection:

```json
{
  "info": {
    "name": "SortMyScene API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "header": [{ "key": "Content-Type", "value": "application/json" }],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Alice\", \"email\": \"alice@example.com\", \"password\": \"pass123\"}"
        },
        "url": { "raw": "http://localhost:5000/api/auth/register" }
      }
    },
    {
      "name": "List Events",
      "request": {
        "method": "GET",
        "url": { "raw": "http://localhost:5000/api/events" }
      }
    }
  ]
}
```

---

## Tips for Testing

1. **Use Postman or Insomnia** for easier request management and token storage.
2. **Set up environment variables** in Postman:
   - `BASE_URL`: `http://localhost:5000`
   - `TOKEN`: (save from register/login response)
   - `EVENT_ID`: (save from list events)
   - `RESERVATION_ID`: (save from reserve response)

3. **Test concurrent requests** using browser DevTools or Postman's collection runner.
4. **Monitor MongoDB** with MongoDB Compass to see real-time seat status changes.

---

## Monitoring & Debugging

### View Server Logs

```bash
npm run dev
```

### Check MongoDB Directly

```bash
mongosh  # Connect to MongoDB
use sortmyscene
db.events.find()
db.seats.find({ status: "reserved" })
db.reservations.find()
```

---

Happy testing! 🚀
