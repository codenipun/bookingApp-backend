import express from 'express'
import {verifyAdmin} from "../utils/verifyToken.js"
import {createRoom, updateRoom, getRoom, getRooms, deleteRoom, updateRoomAvailability, bookRoom} from "../controllers/room.js"

const router = express.Router();

//create Room
router.post("/:hotelid", verifyAdmin, createRoom);

// update room
router.put("/:id", verifyAdmin, updateRoom);

// update room Availability
router.put("/availability/:id", updateRoomAvailability);

//Delete room
router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);

// get single room
router.get("/:id", getRoom);

//get all rooms
router.get("/", getRooms);

//book a room
router.post("/:userid/:hotelid/:id", bookRoom);


export default router;

// {
//     "title" : "Superior Apartment",
//     "price" : "4200",
//     "maxPeople" : "4",
//     "desc" : "2 queen bed | 1 sofa bed | Entire apartment | 167 m² | Private kitchen | Attached bathroom | Air conditioning",
//     "roomNumbers": [
//         {
//             "number": "301"
//         },
//         {
//             "number": "302"
//         },
//         {
//             "number": "303"
//         },
//         {
//             "number": "304"
//         }
//     ]
// }