const mongoose = require('mongoose');
module.exports = mongoose.model('Training', new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  trainer: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true }));
