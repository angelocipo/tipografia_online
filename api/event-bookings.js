// Vercel serverless function — GET /api/event-bookings
// Date già prenotate (pagate) della Struttura per Eventi, per oscurarle nel calendario.
const { getBooked, kvReady } = require('./_bookings');

module.exports = async (req, res) => {
  try {
    const booked = await getBooked();
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ booked, active: kvReady() });
  } catch (e) {
    console.error('event-bookings', e);
    res.status(200).json({ booked: [], active: false });
  }
};
