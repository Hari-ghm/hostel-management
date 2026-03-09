require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Block = require('./models/Block');
const Room = require('./models/Room');
const MessMenu = require('./models/MessMenu');
const Announcement = require('./models/Announcement');
const Visitor = require('./models/Visitor');
const Fee = require('./models/Fee');
const Complaint = require('./models/Complaint');
const Attendance = require('./models/Attendance');
const Laundry = require('./models/Laundry');

const connectDB = require('./config/db');

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Clearing database...');
    await User.deleteMany();
    await Block.deleteMany();
    await Room.deleteMany();
    await MessMenu.deleteMany();
    await Announcement.deleteMany();
    await Visitor.deleteMany();
    await Fee.deleteMany();
    await Complaint.deleteMany();
    await Attendance.deleteMany();
    await Laundry.deleteMany();

    console.log('Database cleared. Seeding massive data...');

    // 1. Create Staff
    const warden1 = await User.create({ name: 'John Doe', email: 'john.w@nova.edu', password: 'password123', role: 'Warden', contactNumber: '+1 234 567 8900' });
    const warden2 = await User.create({ name: 'Sarah Connor', email: 'sarah.c@nova.edu', password: 'password123', role: 'Warden', contactNumber: '+1 234 567 8901' });
    const admin1 = await User.create({ name: 'Admin Master', email: 'admin@nova.edu', password: 'password123', role: 'Admin', contactNumber: '+1 999 999 9999' });
    const maint1 = await User.create({ name: 'Mike Smith', email: 'mike.m@nova.edu', password: 'password123', role: 'Maintenance Staff' });
    const maint2 = await User.create({ name: 'Bob Builder', email: 'bob.b@nova.edu', password: 'password123', role: 'Maintenance Staff' });
    const messSec = await User.create({ name: 'Gordon Ramsay', email: 'gordon.r@nova.edu', password: 'password123', role: 'Mess Manager' });

    // 2. Create Blocks
    const blockA = await Block.create({ name: 'Block A - Alpha', description: 'First year undergraduate block', warden: warden1._id, totalFloors: 4, capacity: 200 });
    const blockB = await Block.create({ name: 'Block B - Beta', description: 'Senior undergraduate block', warden: warden2._id, totalFloors: 5, capacity: 250 });
    const blockC = await Block.create({ name: 'Block C - Gamma', description: 'Postgraduate and PhD block', warden: warden1._id, totalFloors: 3, capacity: 100 });

    // 3. Create Students (10 Students)
    const students = await User.insertMany(Array.from({ length: 10 }).map((_, i) => ({
      name: `Student Name ${i+1}`,
      email: `student${i+1}@nova.edu`,
      password: 'password123',
      role: 'Student',
      registrationNumber: `2024BCE${1000 + i}`,
      hostelBlock: i < 5 ? blockA._id : (i < 8 ? blockB._id : blockC._id)
    })));

    // 4. Create Rooms
    const roomsData = [
      { roomNumber: 'A-101', block: blockA._id, floor: 1, type: '2-Seater', capacity: 2, occupants: [students[0]._id, students[1]._id], status: 'Full', amenities: { hasAC: true, hasAttachedBath: false } },
      { roomNumber: 'A-102', block: blockA._id, floor: 1, type: '2-Seater', capacity: 2, occupants: [students[2]._id], status: 'Available', amenities: { hasAC: true, hasAttachedBath: false } },
      { roomNumber: 'A-201', block: blockA._id, floor: 2, type: '3-Seater', capacity: 3, occupants: [students[3]._id, students[4]._id], status: 'Available', amenities: { hasAC: false, hasAttachedBath: false } },
      { roomNumber: 'B-101', block: blockB._id, floor: 1, type: '1-Seater', capacity: 1, occupants: [students[5]._id], status: 'Full', amenities: { hasAC: true, hasAttachedBath: true } },
      { roomNumber: 'B-102', block: blockB._id, floor: 1, type: '1-Seater', capacity: 1, occupants: [], status: 'Available', amenities: { hasAC: true, hasAttachedBath: true } },
      { roomNumber: 'B-205', block: blockB._id, floor: 2, type: '3-Seater', capacity: 3, occupants: [students[6]._id, students[7]._id], status: 'Available', amenities: { hasAC: false, hasAttachedBath: true } },
      { roomNumber: 'C-301', block: blockC._id, floor: 3, type: '4-Seater Dorm', capacity: 4, occupants: [students[8]._id, students[9]._id], status: 'Available', amenities: { hasAC: true, hasAttachedBath: true } },
      { roomNumber: 'C-302', block: blockC._id, floor: 3, type: '4-Seater Dorm', capacity: 4, occupants: [], status: 'Maintenance', amenities: { hasAC: true, hasAttachedBath: true } }
    ];
    const rooms = await Room.insertMany(roomsData);

    // Update students with their room references
    for (const room of rooms) {
      if (room.occupants.length > 0) {
        await User.updateMany({ _id: { $in: room.occupants } }, { $set: { room: room._id } });
      }
    }

    // 5. Create Mess Menu for all 7 days
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const menus = days.map(day => ({
      day,
      meals: {
        breakfast: `${day} Special Poha, Milk/Tea, Bread Butter`,
        lunch: `Rajma Chawal, Roti, Salad, ${day} Veg Curry`,
        snacks: `Samosa, Tea/Coffee, Biscuits`,
        dinner: `Paneer Butter Masala, Dal Tadka, Rice, Roti, Dessert`
      },
      lastUpdatedBy: messSec._id
    }));
    await MessMenu.insertMany(menus);

    // 6. Create Announcements
    await Announcement.insertMany([
      { title: 'Water Supply Maintenance', content: 'There will be no water supply tomorrow from 10 AM to 2 PM due to tank cleaning.', author: warden1._id, category: 'Maintenance', priority: 'High', targetAudience: ['All'] },
      { title: 'Hostel Night 2026', content: 'Annual hostel night will be celebrated next Friday in the central ground.', author: warden1._id, category: 'Event', priority: 'Normal', targetAudience: ['Student'] },
      { title: 'Mess Fee Due', content: 'Please pay your mess fee before the 15th to avoid late fines.', author: admin1._id, category: 'Mess', priority: 'Urgent', targetAudience: ['Student'] },
      { title: 'Library Renovation', content: 'Hostel reading room will be closed for renovation this weekend.', author: warden2._id, category: 'General', priority: 'Low', targetAudience: ['All'] },
      { title: 'Pest Control', content: 'Pest control scheduled for Block B on Monday morning.', author: admin1._id, category: 'Maintenance', priority: 'Normal', targetAudience: ['All'] },
      { title: 'Wifi Upgrade', content: 'Internet speeds have been upgraded across all blocks.', author: admin1._id, category: 'General', priority: 'Normal', targetAudience: ['All'] },
    ]);

    // 7. Create Complaints
    await Complaint.insertMany([
      { student: students[0]._id, room: rooms[0]._id, category: 'maintenance', title: 'Fan not working', description: 'The ceiling fan in my room is making a weird noise and has stopped working.', priority: 'high', status: 'open', timeline: [{ status: 'open', notes: 'Complaint logged.' }] },
      { student: students[1]._id, room: rooms[0]._id, category: 'wifi', title: 'Wifi dropping out', description: 'Connection drops frequently.', priority: 'medium', status: 'in-progress', assignedTo: maint1._id, timeline: [{ status: 'open', notes: 'Logged' }, { status: 'in-progress', notes: 'Investigating network switch.' }] },
      { student: students[3]._id, room: rooms[2]._id, category: 'cleanliness', title: 'Washroom dirty', description: 'Common washroom on 2nd floor is not cleaned for 2 days.', priority: 'high', status: 'open' },
      { student: students[5]._id, room: rooms[3]._id, category: 'food', title: 'Cold food served', description: 'Dinner was served cold yesterday.', priority: 'low', status: 'resolved', timeline: [{ status: 'open', notes: 'Logged' }, { status: 'resolved', notes: 'Spoke to mess manager, issue corrected.' }] },
      { student: students[6]._id, room: rooms[5]._id, category: 'maintenance', title: 'Broken Window Glass', description: 'Window pane cracked due to heavy wind.', priority: 'medium', status: 'in-progress', assignedTo: maint2._id },
      { student: students[8]._id, room: rooms[6]._id, category: 'wifi', title: 'Router no power', description: 'Router LED is off.', priority: 'high', status: 'resolved' },
      { student: students[9]._id, room: rooms[6]._id, category: 'security', title: 'Lost delivery package', description: 'My amazon package is missing from security desk.', priority: 'high', status: 'open' },
    ]);

    // 8. Create Visitors
    await Visitor.insertMany([
      { student: students[0]._id, visitorName: 'Ravi Sharma', relationship: 'Father', contactNumber: '+91 9876543210', purpose: 'Visiting son', hostelBlock: blockA._id, expectedEntry: new Date(new Date().getTime() + 86400000), status: 'Approved', approvedBy: warden1._id },
      { student: students[1]._id, visitorName: 'Suresh Patel', relationship: 'Brother', contactNumber: '+91 9123456780', purpose: 'Delivering items', hostelBlock: blockA._id, expectedEntry: new Date(), status: 'Pending' },
      { student: students[5]._id, visitorName: 'Anil Kumar', relationship: 'Uncle', contactNumber: '+91 8888888888', purpose: 'Emergency visit', hostelBlock: blockB._id, expectedEntry: new Date(new Date().getTime() - 86400000), status: 'Approved', approvedBy: warden2._id, actualEntry: new Date(new Date().getTime() - 86000000), actualExit: new Date(new Date().getTime() - 80000000) },
      { student: students[6]._id, visitorName: 'Local Guardian', relationship: 'Guardian', contactNumber: '+91 7777777777', purpose: 'Taking student home for weekend', hostelBlock: blockB._id, expectedEntry: new Date(new Date().getTime() + 2 * 86400000), status: 'Rejected', rejectionReason: 'Pending parent approval' },
      { student: students[8]._id, visitorName: 'Courier Agent', relationship: 'Delivery', contactNumber: '+91 9998887776', purpose: 'Delivering laptop', hostelBlock: blockC._id, expectedEntry: new Date(), status: 'Pending' },
    ]);

    // 9. Create Fees (Multiple Types)
    await Fee.insertMany([
      { student: students[0]._id, feeType: 'Hostel Fee', amount: 45000, dueDate: new Date(new Date().getTime() + 30 * 86400000), status: 'Unpaid' },
      { student: students[1]._id, feeType: 'Mess Fee', amount: 15000, dueDate: new Date(), status: 'Paid', amountPaid: 15000, paymentHistory: [{ amount: 15000, paymentMethod: 'Online', transactionId: 'TXN1029384756' }] },
      { student: students[2]._id, feeType: 'Laundry', amount: 500, dueDate: new Date(new Date().getTime() - 5 * 86400000), status: 'Overdue' },
      { student: students[3]._id, feeType: 'Hostel Fee', amount: 45000, dueDate: new Date(new Date().getTime() + 30 * 86400000), status: 'Partial', amountPaid: 20000, paymentHistory: [{ amount: 20000, paymentMethod: 'Bank Transfer', transactionId: 'NEFT999888' }] },
      { student: students[4]._id, feeType: 'Damage Fine', amount: 1000, dueDate: new Date(new Date().getTime() + 2 * 86400000), status: 'Unpaid', description: 'Broken chair' },
      { student: students[5]._id, feeType: 'Hostel Fee', amount: 60000, dueDate: new Date(new Date().getTime() + 30 * 86400000), status: 'Paid', amountPaid: 60000, paymentHistory: [{ amount: 60000, paymentMethod: 'Online', transactionId: 'TXN11223344' }] },
      { student: students[6]._id, feeType: 'Mess Fee', amount: 15000, dueDate: new Date(new Date().getTime() + 10 * 86400000), status: 'Unpaid' },
      { student: students[7]._id, feeType: 'Hostel Fee', amount: 45000, dueDate: new Date(new Date().getTime() - 10 * 86400000), status: 'Overdue' },
    ]);

    // 10. Create Laundry
    await Laundry.insertMany([
      { student: students[0]._id, itemsCount: 5, weightInKg: 2, status: 'Pending', clothingTypes: ['Shirt', 'Pants/Jeans'] },
      { student: students[1]._id, itemsCount: 10, weightInKg: 4, status: 'Washing', clothingTypes: ['Shirt', 'T-Shirt', 'Undergarments'] },
      { student: students[2]._id, itemsCount: 3, weightInKg: 1.5, status: 'Ready for Pickup', clothingTypes: ['Bedsheet', 'Towel'] },
      { student: students[3]._id, itemsCount: 8, weightInKg: 3, status: 'Delivered', clothingTypes: ['T-Shirt', 'Pants/Jeans'] },
    ]);
    
    // 11. Create Attendance
    await Attendance.insertMany([
      { student: students[0]._id, hostelBlock: blockA._id, status: 'Present', markedBy: warden1._id },
      { student: students[1]._id, hostelBlock: blockA._id, status: 'Present', markedBy: warden1._id },
      { student: students[2]._id, hostelBlock: blockA._id, status: 'Absent', markedBy: warden1._id },
      { student: students[5]._id, hostelBlock: blockB._id, status: 'On Leave', leaveRequest: { startDate: new Date(), endDate: new Date(new Date().getTime() + 2*86400000), reason: 'Family function', status: 'Approved', approvedBy: warden2._id } },
    ]);

    console.log('Massive Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
