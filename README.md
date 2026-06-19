# SortMyScene -fullstack developer position

## Prerequisites

1.Node.js 18+
2.MongoDB Atlas (or local replica set — **required for transactions**)

## setup

### 1. Backend


cd backend/sortmyscene-backend
npm install
npm run seed           # populate sample events + seats
npm run dev            # starts on http://localhost:5000

### 2. Frontend

cd frontend
npm install
npm run dev            # starts on http://localhost:3000


### for setting up with github 

1. Clone the repository:
git clone <repo_url>

2. Go to the backend folder:
cd backend/sortmyscene-backend

3. Install dependencies and seed the database:
npm install
npm run seed

4. Start the backend server:
npm run dev

5. Open another terminal, go to the frontend folder, install dependencies and start the frontend:
cd frontend
npm install
npm run dev


### 3.Auth

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- JWT stored in `localStorage`; sent as `Authorization: Bearer <token>`
- Reserve and booking endpoints require authentication

### 4.Design Decisions

#### Double-booking prevention

MongoDB multi-document transactions wrap both reserve and confirm flows:

1.Reserve: "Seat.updateMany" only updates seats where "status === "available"
2.Confirm: "Seat.updateMany" only updates seats where "status === "reserved"
3.If "modifiedCount" doesn't match the requested count, the transaction aborts with 409 error message 

A compound unique index on { eventId, seatNumber } prevents duplicate seat records.

### Expired reservations

1. Each reservation has "expiresAt" 10 minutes from creation
2. MongoDB TTL index auto-deletes expired reservation documents
3. "GET /api/events/:id" releases orphaned reserved seats before returning the grid
4. "POST /api/bookings" returns 410 error message if the reservation is expired

## Assumptions

1. Seat price is a flat $149 on the frontend not stored in the backend Event model
2. Confirmed bookings are persisted in browser localStorage for the My Tickets view
3. Frontend maps backend event fields name, dateTime, venue to the UI

