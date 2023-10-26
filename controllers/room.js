import Rooms from "../models/Rooms.js";
import Hotel from "../models/Hotel.js"
import User from "../models/User.js";


export const createRoom = async(req, res, next)=>{
    const hotelId = req.params.hotelid;
    const newRoom = new Rooms(req.body);

    try {
        const savedRoom = await newRoom.save();
        try {
            await Hotel.findByIdAndUpdate(hotelId, {
                $push: {rooms : savedRoom._id}
            });
        } catch (err) {
            next(err);
        }
        res.status(200).json(savedRoom);
    } catch (err) {
        next(err);
    }
}

export const updateRoom = async(req, res, next) =>{
    try {
        const updatedRoom = await Rooms.findByIdAndUpdate(req.params.id, {$set : req.body}, {new:true});
        res.status(200).json(updatedRoom)  
    } catch (err) {
        next(err)
    }
}

export const updateRoomAvailability = async (req, res, next) => {
    try {
      await Rooms.updateOne(
        { "roomNumbers._id": req.params.id },
        {
          $push: {
            "roomNumbers.$.unavailableDates": req.body.dates
          },
        }
      );
      res.status(200).json("Room status has been updated.");
    } catch (err) {
      next(err);
    }
  };

export const deleteRoom = async(req, res, next) =>{
    const hotelId = req.params.hotelid;

    try {
        await Rooms.findByIdAndDelete(req.params.id);
        try {
            await Hotel.findByIdAndUpdate(hotelId,{
                $pull : {rooms : req.params.id}
            })
        } catch (err) {
            
        }
        
        res.status(200).json("Room has been deleted")  
    } catch (err) {
        next(err)
    }
}

export const getRoom = async(req, res, next) =>{
    try {
        const room = await Hotel.findById(req.params.id);
        res.status(200).json(room)  
    } catch (err) {
        next(err);
    }
}

export const getRooms = async(req, res, next) =>{
    try {
        const rooms = await Rooms.find();
        res.status(200).json(rooms);  
    } catch (err) {
        next(err);
    }
}
export const bookRoom = async(req, res, next) =>{
    const hotelid = req.params.hotelid;
    // const newRoom = new Rooms(req.body);
    // const roomId = req.params.id;
    const checkin = req.body.checkin;
    const checkout = req.body.checkout;
    const price = req.body.price;
    try {
        await User.findByIdAndUpdate(req.params.userid , {
            $push: {bookings : {
                        checkin : checkin,
                        checkout : checkout,
                        hotelId : hotelid,
                        roomId : req.params.id,
                        price : price,
                        hotelName : req.body.hotelName,
                        hotelImg : req.body.hotelImg,
                        bookingDate : req.body.bookingDate
                    }}})
            res.status(200).json(User);  
    } catch (err) {
        next(err);
    }
}