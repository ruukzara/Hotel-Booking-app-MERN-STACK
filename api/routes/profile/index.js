import express from "express"
import { Profile } from "../../controllers/index.js"
import { UserOnly } from "../../lib/index.js"

const router = express.Router()

router.get('/details', Profile.details)

router.get('/reviews', UserOnly, Profile.reviews)

router.get('/bookings', UserOnly, Profile.bookings)

router.route('/edit-profile')
    .put(Profile.edit)
    .patch(Profile.edit)

router.route('/change-password')
    .put(Profile.password)
    .patch(Profile.password)

export default router