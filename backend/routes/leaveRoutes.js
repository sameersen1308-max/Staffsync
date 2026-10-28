const r = require('express').Router();
const c = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');
r.use(protect);
r.post('/', c.apply); r.get('/my', c.mine);
r.get('/', authorize('admin', 'manager'), c.all);
r.put('/:id/status', authorize('admin', 'manager'), c.setStatus);
module.exports = r;
