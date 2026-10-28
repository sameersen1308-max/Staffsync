const Training = require('../models/Training');
exports.list = async (req, res, next) => {
  try { res.json(await Training.find().sort('-startDate')); } catch (e) { next(e); }
};
exports.create = async (req, res, next) => {
  try {
    if (!req.body.title) return res.status(400).json({ message: 'Title required' });
    res.status(201).json(await Training.create({ ...req.body, createdBy: req.user._id }));
  } catch (e) { next(e); }
};
exports.enroll = async (req, res, next) => {
  try {
    const t = await Training.findByIdAndUpdate(req.params.id, { $addToSet: { enrolled: req.user._id } }, { new: true });
    t ? res.json(t) : res.status(404).json({ message: 'Not found' });
  } catch (e) { next(e); }
};
exports.remove = async (req, res, next) => {
  try { await Training.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
};
