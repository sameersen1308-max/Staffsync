const r = require('express').Router();
const c = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');
r.use(protect);
r.post('/checkin', c.checkIn); r.put('/checkout', c.checkOut); r.get('/my', c.mine);
r.get('/', authorize('admin', 'manager'), c.all);
module.exports = r;
