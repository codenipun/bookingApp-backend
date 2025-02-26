import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authRoute from './routes/auth.js'
import hotelsRoute from './routes/hotels.js'
import usersRoute from './routes/users.js'
import roomsRoute from './routes/rooms.js'
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors"

const app = express();
mongoose.set('strictQuery', true);
dotenv.config();

const connect = async()=>{
    try{
        await mongoose.connect(process.env.MONGO);
        console.log('connected to mongodb');
    }catch(error){
        throw error;
    }
};

mongoose.connection.on("disconnected", ()=>{
    console.log("mongoDB disconnected")
})
mongoose.connection.on("connected", ()=>{
    console.log("mongoDB connected")
})

//middlewares

app.use(express.json())
app.use(cookieParser());
app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/auth', authRoute);
app.use('/api/hotels', hotelsRoute);
app.use('/api/users', usersRoute);
app.use('/api/rooms', roomsRoute);

app.use((err, req, res) => {
    const errorStatus = err.status || 500;
    const message = req.message || "Something went wrong";
    const errorMessage = err.message;
    return res.status(errorStatus).json({
        success : false,
        status : errorStatus,
        message : message,
        error: errorMessage,
        stack : err.stack
    })
})
app.listen(process.env.PORT || 3001, ()=>{
    connect();
    console.log("connected to backend");
});
