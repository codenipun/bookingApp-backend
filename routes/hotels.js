import express from 'express'
import { countByType, countByCity, createHotel, deleteHotel, getHotel, getHotels, updateHotel, getHotelRooms, getByType } from '../controllers/hotel.js';
import { verifyAdmin } from '../utils/verifyToken.js';
const router = express.Router();

//CREATE
router.post('/', verifyAdmin, createHotel);

//UPDATE
router.put('/:id',verifyAdmin, updateHotel);

//DELETE
router.delete('/:id',verifyAdmin, deleteHotel);

//GET
router.get('/find/:id', getHotel);

//GET ALL
router.get('/', getHotels);

router.get('/', getHotels)
router.get('/countByCity', countByCity);
router.get('/countByType', countByType);
router.get('/getByType', getByType);
router.get('/room/:id', getHotelRooms);

export default router;