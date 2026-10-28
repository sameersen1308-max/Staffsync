const Attendance = require('../models/Attendance');
const today = () => new Date().toISOString().slice(0, 10);

exports.checkIn = async (req, res, next) => {
  try {
    if (await Attendance.findOne({ employee: req.user._id, date: today() }))
      return res.status(400).json({ message: 'Already checked in today' });
    const now = new Date();
    const status = now.getHours() >= 10 ? 'late' : 'present';
    res.status(201).json(await Attendance.create({ employee: req.user._id, date: today(), checkIn: now, status }));
  } catch (e) { next(e); }
};
exports.checkOut = async (req, res, next) => {
  try {
    const rec = await Attendance.findOne({ employee: req.user._id, date: today() });
    if (!rec) return res.status(400).json({ message: 'Check in first' });
    if (rec.checkOut) return res.status(400).json({ message: 'Already checked out' });
    rec.checkOut = new Date(); await rec.save(); res.json(rec);
  } catch (e) { next(e); }
};
exports.mine = async (req, res, next) => {
  try { res.json(await Attendance.find({ employee: req.user._id }).sort('-date').limit(60)); } catch (e) { next(e); }
};
exports.all = async (req, res, next) => {
  try {
    const q = req.query.date ? { date: req.query.date } : {};
    res.json(await Attendance.find(q).populate('employee', 'name department').sort('-date').limit(300));
  } catch (e) { next(e); }
};
