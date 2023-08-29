import express from "express"
import { Cms } from "../../controllers/index.js"

const router = express.Router()

router.get('/', Cms.Bookings.getBookings)

router.route('/:id')
    .put(Cms.Bookings.update)
    .patch(Cms.Bookings.update)
    .delete(Cms.Bookings.deleteBooking)

export default router
