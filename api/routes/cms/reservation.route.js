import express from "express"
import { Cms } from "../../controllers/index.js"

const router = express.Router()

router.route('/')
    .get(Cms.Reservation.getAllReservations)
    .post(Cms.Reservation.newReservation)
router.route('/:id')
    .get(Cms.Reservation.getReservationById)
    .put(Cms.Reservation.updateReservation)
    .patch(Cms.Reservation.updateReservation)
    .delete(Cms.Reservation.deleteReservation)

export default router
