const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  department: { type: String, default: 'General' },
  position: { type: String, default: 'Staff' },
  phone: String,
  salary: Number,
  joinDate: { type: Date, default: Date.now },
  leaveBalance: { type: Number, default: 20 }
}, { timestamps: true });

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
schema.methods.matchPassword = function (p) { return bcrypt.compare(p, this.password); };
module.exports = mongoose.model('User', schema);
