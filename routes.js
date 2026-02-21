const express = require("express");
const router = express.Router();
const { hotelRooms, findOptimalRooms, initializeRooms} = require('./utlis')

router.get("/rooms", (req, res) => {
  res.json({
    success: true,
    rooms: Object.values(hotelRooms),
    stats: {
      total: 97,
      booked: Object.values(hotelRooms).filter((r) => r.booked).length,
      available: Object.values(hotelRooms).filter((r) => !r.booked).length,
    },
  });
});

router.post("/book", (req, res) => {
  const { count } = req.body;

  if (!count || !Number.isInteger(count)) {
    return res
      .status(400)
      .json({ success: false, message: "count must be an integer." });
  }
  if (count < 1 || count > 5) {
    return res
      .status(400)
      .json({
        success: false,
        message: "You can book 1 to 5 rooms at a time.",
      });
  }

  const availableCount = Object.values(hotelRooms).filter(
    (r) => !r.booked
  ).length;
  if (count > availableCount) {
    return res.status(400).json({
      success: false,
      message: `Only ${availableCount} room(s) available. Cannot book ${count}.`,
    });
  }

  const result = findOptimalRooms(count);

  if (!result) {
    return res
      .status(500)
      .json({ success: false, message: "Could not find suitable rooms." });
  }

  Object.values(hotelRooms).forEach((r) => {
    r.newlyBooked = false;
  });

  result.roomIds.forEach((id) => {
    hotelRooms[id].booked = true;
    hotelRooms[id].newlyBooked = true;
  });

  res.json({
    success: true,
    bookedRooms: result.roomIds,
    travelTime: result.travelTime,
    rooms: Object.values(hotelRooms),
    stats: {
      total: 97,
      booked: Object.values(hotelRooms).filter((r) => r.booked).length,
      available: Object.values(hotelRooms).filter((r) => !r.booked).length,
    },
  });
});

router.post("/random", (req, res) => {
  Object.values(hotelRooms).forEach((r) => {
    r.booked = false;
    r.randomlyOccupied = false;
    r.newlyBooked = false;
  });

  const allIds = Object.keys(hotelRooms).map(Number);
  const shuffled = allIds.sort(() => Math.random() - 0.5);

  const occupyCount = Math.floor(allIds.length * (0.4 + Math.random() * 0.2));
  shuffled.slice(0, occupyCount).forEach((id) => {
    hotelRooms[id].booked = true;
    hotelRooms[id].randomlyOccupied = true;
  });

  res.json({
    success: true,
    occupiedCount: occupyCount,
    rooms: Object.values(hotelRooms),
    stats: {
      total: 97,
      booked: Object.values(hotelRooms).filter((r) => r.booked).length,
      available: Object.values(hotelRooms).filter((r) => !r.booked).length,
    },
  });
});

router.post("/reset", (req, res) => {
  const rooms = initializeRooms();
  res.json({
    success: true,
    message: "All bookings cleared.",
    rooms: Object.values(rooms),
    stats: { total: 97, booked: 0, available: 97 },
  });
});

module.exports = router
