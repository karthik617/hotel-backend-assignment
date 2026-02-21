const express = require('express');
const cors = require('cors');
const router = require('./routes')
const app = express();
app.use(cors());
app.use(express.json());
app.use((req,res, next) => {
    console.info('REQ endpoint: %s ::: RES status: %d', req.url, res.statusCode)
    next()
})
app.get('/health', (req,res) => {
  res.status(200).send({message:"OK", status: 200})
})
app.get('/', (req,res) => {
  res.status(200).send("OK")
})
app.use('/api',router)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n Hotel Reservation API running on http://localhost:${PORT}`);
  console.log(`   GET  /api/rooms   — fetch room state`);
  console.log(`   POST /api/book    — book N rooms`);
  console.log(`   POST /api/random  — random occupancy`);
  console.log(`   POST /api/reset   — reset all bookings\n`);
});