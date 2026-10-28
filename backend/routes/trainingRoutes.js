const r = require('express').Router();
const c = require('../controllers/trainingController');
const { protect, authorize } = require('../middleware/auth');
r.use(protect);
r.get('/', c.list); r.post('/:id/enroll', c.enroll);
r.post('/', authorize('admin', 'manager'), c.create);
r.delete('/:id', authorize('admin', 'manager'), c.remove);
module.exports = r;
