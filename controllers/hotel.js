import Hotel from "../models/Hotel.js";
import Room from "../models/Rooms.js";

export const createHotel = async(req, res, next) =>{
    const newHotel = new Hotel(req.body);

    try {
        const savedHotel = await newHotel.save();
        res.status(200).json(savedHotel)  
    } catch (err) {
        next(err);
    }
}
export const updateHotel = async(req, res, next) =>{
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, {$set : req.body}, {new:true});
        res.status(200).json(updatedHotel)  
    } catch (err) {
        next(err)
    }
}
export const deleteHotel = async(req, res, next) =>{
    try {
        await Hotel.findByIdAndDelete(req.params.id);
        res.status(200).json("hotel has been deleted");  
    } catch (err) {
        next(err);
    }
}
export const getHotel = async(req, res, next) =>{
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel)  
    } catch (err) {
        next(err);
    }
}

export const getHotels = async(req, res, next) => {
    const { 
        min = 0, 
        max = 49999, 
        page = 1, 
        limit = 10, 
        sortOrder = "asc", 
        sortBy = "cheapestPrice", 
        ...others 
    } = req.query;

    try {
        const skip = (page - 1) * limit;

        const sort = sortOrder === "asc" ? 1 : -1;

        const sortField = sortBy === "rating" ? "rating" : "cheapestPrice";

        const hotels = await Hotel.find({
            ...others,
            cheapestPrice: { $gt: min, $lt: max },
        })
        .sort({ [sortField]: sort })
        .skip(Number(skip))
        .limit(Number(limit));

        const totalHotels = await Hotel.countDocuments({
            ...others,
            cheapestPrice: { $gt: min, $lt: max },
        });

        // const totalPages = Math.ceil(totalHotels / limit);

        res.status(200).json({
            success: true,
            data: hotels,
            rows: totalHotels,
            // totalPages,
            page: Number(page),
            // limit: Number(limit),
        });
    } catch (err) {
        next(err);
    }
};

export const countByCity = async(req, res, next) =>{
    const cities = req.query.cities.split(",");

    try {
        const list = await Promise.all(cities.map(city=>{
            return Hotel.countDocuments({city : city});
        }))
        res.status(200).json(list)  
    } catch (err) {
        next(err);
    }
}

export const countByType = async(req, res, next) =>{
    try {
        const hotelCount = await Hotel.countDocuments({type : "hotel"})
        const apartmentCount = await Hotel.countDocuments({type : "apartment"})
        const resortCount = await Hotel.countDocuments({type : "resort"})
        const villaCount = await Hotel.countDocuments({type : "villa"})
        const cabinCount = await Hotel.countDocuments({type : "cabin"})
        res.status(200).json([
            { type:"hotel", count:hotelCount },
            { type:"apartment", count:apartmentCount },
            { type:"resort", count:resortCount },
            { type:"villa", count:villaCount },
            { type:"cabin", count:cabinCount },
        ])  
    } catch (err) {
        next(err);
    }
}

export const getByType = async(req, res, next)=>{
     const ptype = req.query.type;
     try {
        const list = await Hotel.find({type : ptype});
        res.status(200).json(list)
     } catch (error) {
        next(err); 
     }
}

export const getHotelRooms = async(req,res,next)=>{
    try {
        const hotel = await Hotel.findById(req.params.id);
        const list = await Promise.all(hotel.rooms.map((room)=>{
            return Room.findById(room)
        }));
        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
}