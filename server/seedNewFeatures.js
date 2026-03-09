const mongoose = require('mongoose');
const Complaint = require('./models/Complaint');
const Visitor = require('./models/Visitor');
const Fee = require('./models/Fee');
const Room = require('./models/Room');
const User = require('./models/User');
const Block = require('./models/Block');

mongoose.connect('mongodb://localhost:27017/hostel-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB');

  // get a user
  let user = await User.findOne({ role: 'student' });
  if (!user) {
    user = await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: 'password123',
      role: 'student'
    });
  }

  // get a block
  let block = await Block.findOne();
  if (!block) {
    block = await Block.create({
      name: 'Block A',
      manager: user._id
    });
  }

  // get a room
  let room = await Room.findOne();
  if (!room) {
    room = await Room.create({
      roomNumber: 'A101',
      block: block._id,
      floor: 1,
      type: '1-Seater',
      capacity: 1,
      occupants: [user._id],
      status: 'Full'
    });
    console.log('Room created');
  } else {
    console.log('Room already exists');
  }

  // Complaints
  const complaintCount = await Complaint.countDocuments();
  if (complaintCount === 0) {
    await Complaint.create([
      {
        student: user._id,
        room: room._id,
        category: 'wifi',
        title: 'WiFi not working',
        description: 'No internet connection in A101 since morning.',
        priority: 'high',
        status: 'open'
      },
      {
        student: user._id,
        room: room._id,
        category: 'maintenance',
        title: 'Leaking tap',
        description: 'The tap in the bathroom is leaking.',
        priority: 'medium',
        status: 'in-progress'
      }
    ]);
    console.log('Complaints seeded');
  } else {
    console.log('Complaints already exist');
  }

  // Visitors
  const visitorCount = await Visitor.countDocuments();
  if (visitorCount === 0) {
    await Visitor.create([
      {
        student: user._id,
        visitorName: 'John Doe',
        relationship: 'Father',
        contactNumber: '1234567890',
        purpose: 'Meeting',
        hostelBlock: block._id,
        expectedEntry: new Date(),
        status: 'Approved'
      }
    ]);
    console.log('Visitors seeded');
  } else {
    console.log('Visitors already exist');
  }

  // Fees
  const feeCount = await Fee.countDocuments();
  if (feeCount === 0) {
    await Fee.create([
      {
        student: user._id,
        feeType: 'Hostel Fee',
        amount: 50000,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: 'Unpaid'
      },
      {
        student: user._id,
        feeType: 'Mess Fee',
        amount: 20000,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        status: 'Paid',
        amountPaid: 20000
      }
    ]);
    console.log('Fees seeded');
  } else {
    console.log('Fees already exist');
  }

  console.log('Done');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
