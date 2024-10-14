const { StatusCodes } = require('http-status-codes');
const Room = require('../models/Room');

const retrieveRoom = async (req,res) => {
    const {price} = req.body;
    const room = await Room.findOne({price: price}).where("members").ne(100)
    if(room)
        return res.status(StatusCodes.OK).json({success:true, room})
    else
        return res.status(StatusCodes.OK).json({success:false})

}

const enteringRoom = async (req, res) => {
    const {userid,positions,price, roomid, roomNumber} = req.body
    const room = await Room.findById(roomid);
    if (room){
        if (100 - room.members > positions.length){
            positions.map((pos) => {
                room.users.push({userid,position:{x:pos.x,y:pos.y}})
            })
            room.members += positions.length
            return res.status(StatusCodes.OK).json({success:true, room})
        }else{
            return res.StatusCodes(StatusCode.OK).json({success:false, msg: "The ball count overflowed"})
        }
    }else{
        const room = new Room()
        positions.map((pos) => {
            room.users.push({userid,position:{x:pos.x,y:pos.y}})
        })
        room.members = positions.length
        room.roomNumber = roomNumber
        room.price = price
        room.prize = price * 100
        room.save()
        return res.status(StatusCodes.OK).json({room})
    }
};

module.exports = {
    retrieveRoom,
    enteringRoom,
};
