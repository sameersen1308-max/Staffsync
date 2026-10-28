const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const out = (u) => ({ _id: u._id, name: u.name, email: u.email, role: u.role, department: u.department, position: u.position });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(400).json({ message: 'Email already registered' });
    const isFirst = (await User.countDocuments()) === 0;
    const user = await User.create({ name, email, password, role: isFirst ? 'admin' : 'employee' });
    res.status(201).json({ token: sign(user._id), user: out(user) });
  } catch (e) { next(e); }
};
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase() });
    if (!user || !(await user.matchPassword(req.body.password || '')))
      return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user._id), user: out(user) });
  } catch (e) { next(e); }
};
exports.me = (req, res) => res.json(req.user);
