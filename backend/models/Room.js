const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    members: {type:Number, default: 0},
    roomNumber: {type:Number, default:0},
    users: [{ 
        userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        positions: {x:{type:Number}, y:{type:Number}}
    }],
    price: { type: Number, default: 1},
    prize: {type: Number, default: 100},
});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;
