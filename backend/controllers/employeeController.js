const User = require('../models/User');

exports.list = async (req, res, next) => {
  try { res.json(await User.find().select('-password').sort('-createdAt')); } catch (e) { next(e); }
};
exports.get = async (req, res, next) => {
  try {
    if (req.user.role === 'employee' && req.params.id !== String(req.user._id))
      return res.status(403).json({ message: 'Forbidden' });
    const u = await User.findById(req.params.id).select('-password');
    u ? res.json(u) : res.status(404).json({ message: 'Not found' });
  } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try {
    if (await User.findOne({ email: (req.body.email || '').toLowerCase() })) return res.status(400).json({ message: 'Email exists' });
    const u = await User.create({ password: 'Welcome@123', ...req.body });
    const { password, ...rest } = u.toObject();
    res.status(201).json(rest);
  } catch (e) { next(e); }
};
exports.update = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id);
    if (!u) return res.status(404).json({ message: 'Not found' });
    ['name', 'email', 'role', 'department', 'position', 'phone', 'salary', 'leaveBalance', 'password']
      .forEach(k => { if (req.body[k] !== undefined && req.body[k] !== '') u[k] = req.body[k]; });
    await u.save();
    const { password, ...rest } = u.toObject();
    res.json(rest);
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try {
    if (req.params.id === String(req.user._id)) return res.status(400).json({ message: "Can't delete yourself" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};
