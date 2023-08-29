import { anyError, getDatesInRange } from '../../lib/index.js'
import { Reservation, Room } from '../../models/index.js'

class reservationController {
    // Create a new reservation
    newReservation = async (req, res, next) => {
        try {
            const { userId, hotelId, roomId, checkInDate, checkOutDate, guests } = req.body

            const reservation = await Reservation.create({
                userId,
                hotelId,
                roomId,
                checkInDate,
                checkOutDate,
                guests,
            })

            const datesInRange = getDatesInRange(checkInDate, checkOutDate)

            // Update the room with the reservation's check-in, check-out, and dates in between
            await Room.findOneAndUpdate(
                { 'roomNumbers._id': roomId },
                { $push: { 'roomNumbers.$.unavailDates': { $each: datesInRange } } }
            )


            res.status(201).json({
                success: 'Reservation has been successfully placed. You can cancel your reservation at any time for free.',
            })
        } catch (error) {
            anyError(error, next)
        }
    }

    //get all reservations
    getAllReservations = async (req, res, next) => {
        try {
            const reservations = await Reservation.find()

            res.json(reservations)
        } catch (error) {
            next(error)
        }
    }

    // Get a specific reservation by ID
    getReservationById = async (req, res, next) => {
        try {
            const resId = req.params.id

            const reservation = await Reservation.findById(resId)

            if (!reservation) {
                return res.status(404).json({ error: 'Reservation not found.' })
            }

            res.json(reservation)
        } catch (error) {
            next(error)
        }
    }

    // Update a reservation
    updateReservation = async (req, res, next) => {
        try {
            const upResId = req.params.id
            const { userId, hotelId, roomId, checkInDate, checkOutDate, guests } = req.body

            const reservation = await Reservation.findById(upResId, { new: true })

            if (!reservation) {
                return res.status(404).json({ error: 'Reservation not found.' })
            }

            reservation.userId = userId
            reservation.hotelId = hotelId
            reservation.roomId = roomId
            reservation.checkInDate = checkInDate
            reservation.checkOutDate = checkOutDate
            reservation.guests = guests

            const datesInRange = getDatesInRange(checkInDate, checkOutDate)

            await Room.findOneAndUpdate(
                { 'roomNumbers._id': roomId },
                { $set: { 'roomNumbers.$.unavailDates': datesInRange } }
            )

            // Update the reservation with the new check-in and check-out dates
            reservation.checkInDate = checkInDate
            reservation.checkOutDate = checkOutDate

            await reservation.save()

            res.json({
                success: 'Reservation updated.',
            })
        } catch (error) {
            next(error)
        }
    }

    // Delete a reservation
    deleteReservation = async (req, res, next) => {
        try {
            const delId = req.params.id

            const reservation = await Reservation.findByIdAndDelete(delId)

            if (!reservation) {
                return res.status(404).json({ error: 'Reservation not found.' })
            }

            const roomId = reservation.roomId;

            const { checkInDate, checkOutDate } = reservation;

            // Generate an array of dates between check-in and check-out dates
            const datesInRange = getDatesInRange(checkInDate, checkOutDate);

            // Remove the reservation dates from the room's unavailDates array
            await Room.findOneAndUpdate(
                { 'roomNumbers._id': roomId },
                { $pullAll: { 'roomNumbers.$.unavailDates': datesInRange } }
            );

            res.json({
                success: 'Reservation deleted.',
            })
        } catch (error) {
            next(error)
        }
    }
}

export default new reservationController