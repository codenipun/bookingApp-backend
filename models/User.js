import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username : { type : String, required: true, unique : true},
    email : { type : String, required: true, unique :true},
    password : { type : String, required: true},
    isAdmin : { type : Boolean, default:false},
    country : {type : String, required : true},
    img : {type : String},
    city : {type : String, required : true},
    phone : {type : String, required : true},
    bookings: [{
        checkin : {type : Date},
        checkout : {type : Date},
        hotelId : {type : String},
        hotelName : {type : String},
        hotelImg : {type : String},
        bookingDate : {type : Date},
        roomId : {type : String},
        price : {type : Number}
    }]
}, {timestamps:true})

export default mongoose.model("User", userSchema);