const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['present', 'late', 'absent'], default: 'present' }
}, { timestamps: true });
schema.index({ employee: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', schema);
