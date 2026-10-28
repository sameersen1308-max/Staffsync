require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const users = [
    { name: 'Admin', email: 'admin@staffsync.com', password: 'Admin@123', role: 'admin', department: 'HR', position: 'HR Head' },
    { name: 'Maya Manager', email: 'manager@staffsync.com', password: 'Manager@123', role: 'manager', department: 'Engineering', position: 'Team Lead' },
    { name: 'Evan Employee', email: 'employee@staffsync.com', password: 'Employee@123', role: 'employee', department: 'Engineering', position: 'Developer' }
  ];
  for (const u of users) if (!(await User.findOne({ email: u.email }))) await User.create(u);
  console.log('Seeded:\n admin@staffsync.com / Admin@123\n manager@staffsync.com / Manager@123\n employee@staffsync.com / Employee@123');
  process.exit(0);
})();
