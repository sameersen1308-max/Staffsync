const Leave = require('../models/Leave');
const User = require('../models/User');

exports.apply = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    const s = new Date(startDate), e = new Date(endDate);
    if (isNaN(s) || isNaN(e) || e < s) return res.status(400).json({ message: 'Invalid dates' });
    const days = Math.round((e - s) / 86400000) + 1;
    res.status(201).json(await Leave.create({ employee: req.user._id, type, startDate: s, endDate: e, days, reason }));
  } catch (e) { next(e); }
};
exports.mine = async (req, res, next) => {
  try { res.json(await Leave.find({ employee: req.user._id }).sort('-createdAt')); } catch (e) { next(e); }
};
exports.all = async (req, res, next) => {
  try { res.json(await Leave.find().populate('employee', 'name email department').sort('-createdAt')); } catch (e) { next(e); }
};
exports.setStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Not found' });
    if (leave.status !== 'pending') return res.status(400).json({ message: 'Already reviewed' });
    leave.status = status; leave.reviewedBy = req.user._id;
    if (status === 'approved' && leave.type !== 'unpaid')
      await User.findByIdAndUpdate(leave.employee, { $inc: { leaveBalance: -leave.days } });
    await leave.save();
    res.json(leave);
  } catch (e) { next(e); }
};
