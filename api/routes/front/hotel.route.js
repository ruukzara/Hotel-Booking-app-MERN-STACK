import express from "express"
import { Front, Profile } from '../../controllers/index.js'
import { UserOnly, auth } from "../../lib/index.js"

const router = express.Router()


router.get('/latest', Front.Hotel.latest )
router.get('/featured', Front.Hotel.featured )
router.get('/mostly-booked', Front.Hotel.top )
router.get('/:id/similar', Front.Hotel.similar )
router.get('/search/:id', Front.Hotel.byId )
router.get('/search/:id/:roomId', Front.Hotel.byHotelAndRoomId )
router.post('/:id/review', auth, UserOnly, Profile.rating )
router.get('/category/all', Front.Hotel.categories )
router.get('/countbytype', Front.Hotel.byType )


export default router