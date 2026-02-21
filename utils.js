function initializeRooms() {
  const rooms = {};

  for (let floor = 1; floor <= 9; floor++) {
    for (let pos = 1; pos <= 10; pos++) {
      const id = floor * 100 + pos; // 101, 102, ..., 910
      rooms[id] = {
        id,
        floor,
        position: pos,
        booked: false,
        randomlyOccupied: false,
        newlyBooked: false,
      };
    }
  }

  // Floor 10: 7 rooms
  for (let pos = 1; pos <= 7; pos++) {
    const id = 1000 + pos; // 1001–1007
    rooms[id] = {
      id,
      floor: 10,
      position: pos,
      booked: false,
      randomlyOccupied: false,
      newlyBooked: false,
    };
  }

  return rooms;
}

function travelTimeBetween(roomA, roomB) {
  if (roomA.floor === roomB.floor) {
    return Math.abs(roomA.position - roomB.position);
  }
  const walkToStairs = roomA.position - 1; // steps from roomA to stairs
  const floorTravel = Math.abs(roomA.floor - roomB.floor) * 2;
  const walkFromStairs = roomB.position - 1; // steps from stairs to roomB
  return walkToStairs + floorTravel + walkFromStairs;
}

function totalTravelTime(roomIds,hotelRooms) {
  if (roomIds.length <= 1) return 0;
  const sorted = roomIds
    .map((id) => hotelRooms[id])
    .sort((a, b) =>
      a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
    );
  let total = 0;
  for (let i = 1; i < sorted.length; i++) {
    total += travelTimeBetween(sorted[i - 1], sorted[i]);
  }
  return total;
}

function findOptimalRooms(n,hotelRooms) {
  const available = Object.values(hotelRooms)
    .filter((r) => !r.booked)
    .sort((a, b) =>
      a.floor !== b.floor ? a.floor - b.floor : a.position - b.position
    );

  if (available.length < n) return null;

  const availableIds = available.map((r) => r.id);

  let bestIds = null;
  let bestTime = Infinity;

  for (let i = 0; i <= availableIds.length - n; i++) {
    const window = availableIds.slice(i, i + n);
    const time = totalTravelTime(window,hotelRooms);
    if (time < bestTime) {
      bestTime = time;
      bestIds = window;
    }
  }

  return bestIds ? { roomIds: bestIds, travelTime: bestTime } : null;
}

module.exports = {initializeRooms, findOptimalRooms}
