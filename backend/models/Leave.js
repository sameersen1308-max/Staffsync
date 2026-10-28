const mongoose = require('mongoose');
module.exports = mongoose.model('Leave', new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['sick', 'casual', 'annual', 'unpaid'], default: 'casual' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: Number,
  reason: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));
