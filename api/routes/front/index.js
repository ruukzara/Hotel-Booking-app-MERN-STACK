import express from "express"
import hotelRoutes from './hotel.route.js'
import listRoutes from './list.route.js'

const router = express.Router()

router.use('/hotel', hotelRoutes)

router.use(listRoutes)

export default router