# 🏨 Hotel Room Reservation System
### Unstop SDE-3 Assessment Submission

---

## 📁 Project Structure

```
hotel-backend/
  server.js        ← Node.js + Express API (all logic lives here)
  package.json

hotel-frontend/
  src/
    App.jsx        ← React single-file frontend
    main.jsx       ← Vite entry point
  package.json
```

---

## 🚀 Setup & Run

### Backend
```bash
cd hotel-backend
npm install
npm start          # runs on http://localhost:4000
# OR for dev with auto-reload:
npm run dev
```

### Frontend
```bash
cd hotel-frontend
npm install
npm run dev        # runs on http://localhost:5173
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

**Why (pos − 1)?** Because position 1 is AT the stairs (0 steps to reach stairs). Position 5 means 4 steps to reach the stairs.

### Booking Algorithm (2 Steps)

#### Step 1: Same Floor Priority
```
For each floor (1–10):
  Get available rooms on this floor
  If count >= N:
    Use sliding window of size N over sorted rooms
    Calculate travel time for each window
    Track minimum
Return floor with globally minimum travel time
```

#### Step 2: Cross-Floor Fallback
If Step 1 fails (no single floor has N rooms):

```
For windowSize = 2, 3, 4, … 10:
  For each starting floor:
    Collect available rooms in [startFloor … startFloor+windowSize-1]
    If count >= N:
      Sliding window of size N over these sorted rooms
      Track minimum travel time candidate
  If any candidate found → return best one (smallest window wins)
```

**Why sliding window?**
Rooms are sorted by (floor ASC, position ASC). A contiguous window of N in this sorted order naturally forms the tightest possible cluster—both vertically (nearby floors) and horizontally (nearby positions on each floor)—because skipping any room in this sorted sequence would only increase spread.

### Example Walkthrough

Available: `101, 102, 105, 106` on Floor 1, `201–203, 210` on Floor 2.

**Guest requests 4 rooms:**

Step 1 — Check Floor 1: 4 available rooms = [101, 102, 105, 106]
- Window [101,102,105,106]: time = 1+3+1 = 5 min ✓
- No other windows (exactly 4 rooms)

Check Floor 2: 4 available = [201, 202, 203, 210]
- Window [201,202,203,210]: time = 1+1+7 = 9 min

**Floor 1 wins → Book 101, 102, 105, 106 (5 min travel)**

---

**Guest requests 3 rooms, only `101, 102` on Floor 1:**

Step 1 — No floor has ≥ 3 rooms alone.

Step 2 — Window [Floor 1, Floor 2]:
Available: [101, 102, 201, 202, 203, 210]
- Window [101, 102, 201]: time = 1 + (1-1)+(1×2)+(1-1) + 1 = 1+2+1 = 4 min ← picked!
- Window [101, 102, 202]: time = 1 + (1-1)+2+(2-1) + 1+1 = ...
- ... (algorithm finds minimum)

---

## 🎨 Frontend Features

| Feature | Description |
|---------|-------------|
| **Room Grid** | Visual 10-floor hotel map, floor 10 at top |
| **Color Coding** | 🟢 New booking · 🔴 Previous booking · 🟠 Random occupancy · ⬜ Available |
| **Stats Bar** | Live count of total/booked/available + occupancy % bar |
| **Booking Result** | Shows which rooms were booked + travel time + explanation |
| **Algorithm Explainer** | Collapsible panel explaining the algorithm |
| **Responsive** | Works on mobile (small room cells) and desktop |
| **Tooltips** | Hover any room to see room ID, floor, position, status |

---

## 🔧 Tech Stack

- **Backend**: Node.js · Express · CORS
- **Frontend**: React 18 · Vite · Pure CSS-in-JS (no external UI libs)
- **State**: In-memory on backend (easy to swap for PostgreSQL/Redis)
