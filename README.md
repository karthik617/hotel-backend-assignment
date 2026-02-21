# 🏨 Hotel Room Reservation System

---

## 📁 Project Structure

```
hotel-backend/
  server.js        ← Node.js + Express API (all logic lives here)
  package.json
```
---

## 🚀 Setup & Run

### Backend
```bash
cd hotel-backend
npm install
npm start          # runs on http://localhost:4000
```
---

## 🏗️ Hotel Structure

| Floor | Rooms | Room Numbers |
|-------|-------|-------------|
| 1–9 | 10 each | 101–110, 201–210, … 901–910 |
| 10 | 7 | 1001–1007 |
| **Total** | **97** | |

- Stairs/Lift are on the **LEFT** side (Position 1 = closest to stairs)
- Rooms arranged **left → right** (position 1 to 10)

---

## ⚙️ API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Fetch all room states |
| POST | `/api/book` | Book N rooms `{ count: 1-5 }` |
| POST | `/api/random` | Generate random occupancy (40–60%) |
| POST | `/api/reset` | Clear all bookings |

---

## 🧠 Algorithm Deep-Dive

### Travel Time Formula

```
Same floor:      time = |posA − posB|

Different floors: time = (posA − 1)            ← walk from roomA to stairs
                       + |floorA − floorB| × 2  ← climb/descend floors
                       + (posB − 1)             ← walk from stairs to roomB
```

---

## 🔧 Tech Stack

- **Backend**: Node.js · Express · CORS
- **State**: In-memory on backend (easy to swap for PostgreSQL/Redis)
