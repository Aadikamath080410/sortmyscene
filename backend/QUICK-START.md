# 🚀 SortMyScene Backend — Quick Start Guide

## ✅ What's Included

A production-ready **Node.js + Express + MongoDB** backend for an event ticketing platform with:

- ✅ **Atomic seat reservations** (prevents double-booking using MongoDB transactions)
- ✅ **10-minute reservation timer** (TTL indices auto-expire reservations)
- ✅ **JWT authentication** (register, login, protected endpoints)
- ✅ **Event browsing** with live seat availability
- ✅ **Booking confirmation** with expiry validation
- ✅ **Comprehensive error handling** (race conditions, expired reservations, etc.)

---

## 🎯 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env
# Edit .env and add your MongoDB URI and JWT secret
```

**Example .env:**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/sortmyscene
JWT_SECRET=your_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Step 3: Start MongoDB
Ensure MongoDB is running (local or Atlas). If using Atlas, get your connection string.

### Step 4: Seed Database
```bash
npm run seed
```
This creates 3 sample events with seat grids.

### Step 5: Start Server
```bash
npm run dev
```

**Server running at:** `http://localhost:5000`

---

## 🧪 Test Your Setup

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "pass123"
  }'
```

**Save the returned `token`.**

### List Events
```bash
curl http://localhost:5000/api/events
```

### Reserve Seats
```bash
curl -X POST http://localhost:5000/api/reserve \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVENT_ID_HERE",
    "seatNumbers": ["A1", "A2"]
  }'
```

---

## 📖 Full Documentation

- **`README.md`** — Complete setup, API docs, design decisions, constraints
- **`API-TESTING.md`** — Step-by-step testing guide with all endpoints
- **`FILE-STRUCTURE.md`** — Detailed breakdown of every file

---

## 🔧 Backend Architecture

### **Request Flow**
```
Client Request
     ↓
Express Middleware (CORS, JSON parsing)
     ↓
Route Handler
     ↓
Authentication Check (if protected)
     ↓
Validation & Logic
     ↓
MongoDB Transaction (if needed)
     ↓
Response
```

### **Key Files**

| File | Purpose |
|------|---------|
| `server.js` | Express app setup & routes |
| `config/db.js` | MongoDB connection |
| `middleware/auth.js` | JWT verification |
| `models/*.js` | Data schemas |
| `routes/*.js` | API endpoints |
| `seed.js` | Sample data |

---

## 🚨 Important Notes

### MongoDB Replica Set Required
Transactions need MongoDB replica set. If using:
- **MongoDB Atlas** ✅ (free tier supports this)
- **Local MongoDB** → Run as replica set or use transactions=false (simplified)

### API Constraints (As Per Assignment)

| Constraint | Solution |
|-----------|----------|
| Prevent double booking | MongoDB transactions (atomic seat updates) |
| Expired reservations shouldn't allow booking | TTL index + expiry check before confirmation |
| Seat unavailability between selection & reservation | Return 409 with unavailable seats list |

---

## 📋 API Endpoints Summary

### Public
- `POST /api/auth/register` — Sign up
- `POST /api/auth/login` — Log in
- `GET /api/events` — List all events
- `GET /api/events/:id` — Get event with seat grid

### Protected (Requires Bearer Token)
- `GET /api/auth/me` — Get current user
- `POST /api/reserve` — Reserve seats (10 min hold)
- `POST /api/bookings` — Confirm booking
- `GET /api/bookings/my` — My active reservations

---

## 🎓 Design Highlights

### Double-Booking Prevention
```javascript
// Inside MongoDB transaction:
const updateResult = await Seat.updateMany(
  { eventId, seatNumber: { $in: seats }, status: "available" },
  { $set: { status: "reserved" } },
  { session }
);

// If fewer seats updated than expected → race condition detected
if (updateResult.modifiedCount !== seats.length) {
  await session.abortTransaction();
  return res.status(409).json({ message: "Seats taken" });
}
```

### Expiry Handling
```javascript
// Before confirming booking:
if (reservation.expiresAt < new Date()) {
  // Release seats back to available
  await Seat.updateMany(..., { $set: { status: "available" } }, { session });
  await Reservation.findByIdAndDelete(reservationId, { session });
  return res.status(410).json({ message: "Expired" });
}
```

---

## 🐛 Debugging

### Check Server Logs
```bash
npm run dev
```

### Inspect MongoDB
```bash
mongosh
use sortmyscene
db.seats.find({ status: "reserved" })
db.reservations.find()
```

### Use Postman
Import the collection from `API-TESTING.md` and test endpoints with saved tokens.

---

## 🚀 Next Steps

1. **Frontend Integration:** Connect your React frontend to these endpoints
2. **Testing:** Use `API-TESTING.md` to validate all scenarios
3. **Deployment:** Update `.env` with production values
4. **Monitoring:** Set up logs and error tracking (Sentry, DataDog, etc.)

---

## 💡 Pro Tips

- Use Postman or Insomnia to manage requests and tokens
- Test concurrent reservations to verify double-booking prevention
- Monitor MongoDB with MongoDB Compass
- Use `npm run seed` to reset data during testing

---

## ❓ FAQ

**Q: How do I handle CORS errors with my frontend?**  
A: Update `CLIENT_URL` in `.env` to your frontend's URL. Default is `http://localhost:5173` (Vite).

**Q: Can I customize the 10-minute reservation timer?**  
A: Yes! Edit `RESERVATION_DURATION_MS` in `routes/reserve.js`.

**Q: How do I add more events?**  
A: Use the API (`POST /api/events` not implemented) or edit `seed.js` and run `npm run seed` again.

**Q: What if a user doesn't confirm within 10 minutes?**  
A: Reservation expires automatically. Seats return to "available" via TTL index.

---

**Ready to go! 🎉**

Start with `npm install` → `npm run seed` → `npm run dev`

Then test the API endpoints using the guide in `API-TESTING.md`.

For deep dives, check `README.md` (full docs) and `FILE-STRUCTURE.md` (architecture).
