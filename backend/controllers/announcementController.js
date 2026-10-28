const Announcement = require('../models/Announcement');
exports.list = async (req, res, next) => {
  try { res.json(await Announcement.find().populate('postedBy', 'name').sort('-createdAt')); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.message) return res.status(400).json({ message: 'Title and message required' });
    res.status(201).json(await Announcement.create({ ...req.body, postedBy: req.user._id }));
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try { await Announcement.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
};
