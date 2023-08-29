import { anyError, getNumberOfDays } from '../../lib/index.js'
import { Hotel, OrderDetails, Room } from '../../models/index.js'

class OrderDetailsController {

    // Create a new order detail
    createOrderDetail = async (req, res, next) => {
        try {
            const { BookingId, hotelId, roomId, userId, checkInDate, checkOutDate, guests, quantity, roomPrice } = req.body

            // Check if the hotel exists
            const hotel = await Hotel.findById(hotelId)
            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found.' })
            }

            // Check if the room exists
            const room = await Room.findById(roomId)
            if (!room) {
                return res.status(404).json({ error: 'Room not found.' })
            }

            const numberOfDays = getNumberOfDays(checkInDate, checkOutDate);

            // Calculate the total price
            const totalPrice = roomPrice * numberOfDays * quantity;

            // Create the order detail
            const orderDetail = await OrderDetails.create({
                BookingId, hotelId, userId, roomId, checkInDate, checkOutDate, guests, quantity, numberOfDays,
                roomPrice, totalPrice
            })

            res.status(201).json({
                success: 'Order detail created.',
            })
        } catch (error) {
            anyError(error, next)
        }
    }

    //get all order details
    getOrderDetails = async (req, res, next) => {
        try {
            const ordersDetails = await OrderDetails.find()

            res.json(ordersDetails)

        } catch (error) {
            anyError(error, next)
        }
    }

    //get order details by Id
    getOrderDetailById = async (req, res, next) => {
        try {
            const orderId = req.params.id; // Assuming you have the orderId in the URL

            // Find the order detail by orderId
            const orderDetail = await OrderDetails.findById(orderId);

            if (!orderDetail) {
                return res.status(404).json({ error: 'Order detail not found.' });
            }

            res.status(200).json({
                orderDetail,
            });
        } catch (error) {
            // Pass the error to the global error handler middleware
            next(error);
        }
    };



    // Update the order detail
    updateOrderDetail = async (req, res, next) => {
        try {
            const orderId = req.params.id; // Assuming you have the orderId in the URL

            // Update the order detail properties
            const { BookingId, hotelId, roomId, userId, checkInDate, checkOutDate, guests, quantity, roomPrice } = req.body;

            // Check if the hotel exists
            const hotel = await Hotel.findById(hotelId);
            if (!hotel) {
                return res.status(404).json({ error: 'Hotel not found.' });
            }

            // Check if the room exists
            const room = await Room.findById(roomId);
            if (!room) {
                return res.status(404).json({ error: 'Room not found.' });
            }

            const numberOfDays = getNumberOfDays(checkInDate, checkOutDate);

            // Calculate the total price
            const totalPrice = roomPrice * numberOfDays * quantity;

            // Update the order detail using findByIdAndUpdate
            const updatedOrderDetail = await OrderDetails.findByIdAndUpdate(
                orderId,
                {
                    BookingId, hotelId, userId, roomId, checkInDate, checkOutDate, guests, quantity,numberOfDays, roomPrice, totalPrice,
                },
                { new: true } // To return the updated document
            );

            if (!updatedOrderDetail) {
                return res.status(404).json({ error: 'Order detail not found.' });
            }

            res.status(200).json({
                success: 'Order detail updated.',
                orderDetail: updatedOrderDetail,
            });
        } catch (error) {
            // Pass the error to the global error handler middleware
            next(error);
        }
    };



    // Delete an order detail
    deleteOrderDetail = async (req, res, next) => {
        try {
            const orderDetailId = req.params.id

            // Check if the order detail exists
            const orderDetail = await OrderDetails.findById(orderDetailId)
            if (!orderDetail) {
                return res.status(404).json({ error: 'Order detail not found.' })
            }

            // Delete the order detail
            await OrderDetails.findByIdAndDelete(orderDetailId)

            res.status(200).json({ success: 'Order detail deleted.' })
        } catch (error) {
            anyError(error, next)
        }
    }
}

export default new OrderDetailsController
