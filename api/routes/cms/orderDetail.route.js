import express from "express"
import { Cms } from "../../controllers/index.js"

const router = express.Router()

router.route('/')
    .post(Cms.OrderDetails.createOrderDetail)
    .get(Cms.OrderDetails.getOrderDetails)
router.route('/:id')
    .get(Cms.OrderDetails.getOrderDetailById)
    .patch(Cms.OrderDetails.updateOrderDetail)
    .delete(Cms.OrderDetails.deleteOrderDetail)

export default router
