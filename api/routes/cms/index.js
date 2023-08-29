import express from "express"
import hotelRoutes from "./hotel.route.js"
import customerRoutes from "./user.route.js"
import roomRoutes from "./room.route.js"
import categoryRoutes from "./category.route.js"
import reservationRoutes from "./reservation.route.js"
import bookingRoutes from "./booking.route.js"
import brandRoutes from "./brand.route.js"
import staffRoutes from "./staff.route.js"
import reviewRoutes from "./review.route.js"
import orderDetailRoutes from "./orderDetail.route.js"

const router = express.Router()

router.use("/customers", customerRoutes)
router.use("/hotels", hotelRoutes)
router.use("/search", hotelRoutes)
router.use("/rooms", roomRoutes)
router.use("/search", roomRoutes)
router.use("/categories", categoryRoutes)
router.use("/reservation", reservationRoutes)
router.use("/bookings", bookingRoutes)
router.use("/brands", brandRoutes)
router.use("/staffs", staffRoutes)
router.use("/reviews", reviewRoutes)
router.use("/orderdetails", orderDetailRoutes)

export default router