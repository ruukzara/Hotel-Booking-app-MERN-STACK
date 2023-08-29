import mongoose from "mongoose"
import { anyError, getNumberOfDays } from "../../lib/index.js"
import { Booking, Review, User } from "../../models/index.js"
import bcrypt from "bcryptjs"

class ProfileController {
    details = async (req, res, next) => {
        try {
            res.json(req.user)
        } catch (error) {
            anyError(error, next)
        }
    }
    edit = async (req, res, next) => {
        try {
            const { name, phone, address } = req.body

            const updatedUser = await User.findByIdAndUpdate(
                req.uid,
                { name, phone, address },
            )

            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" })
            }

            res.status(200).json({
                success: "Profile Updated.",
            })
        } catch (error) {
            anyError(error, next)
        }
    }

    password = async (req, res, next) => {
        try {
            const { old_password, new_password, confirm_password } = req.body;

            if (bcrypt.compareSync(old_password, req.user.password)) {
                if (new_password === confirm_password) {
                    // Check if the new password is the same as the old password
                    if (old_password === new_password) {
                        return res.status(422).json({ message: 'New password must be different from the old password' });
                    }

                    const hash = bcrypt.hashSync(new_password, bcrypt.genSaltSync(10));

                    await User.findByIdAndUpdate(req.uid, { password: hash });

                    res.json({
                        success: 'Password updated.',
                    });
                } else {
                    next({
                        message: 'Password not confirmed.',
                        status: 422,
                    });
                }
            } else {
                next({
                    message: 'Incorrect old password.',
                    status: 422,
                });
            }
        } catch (error) {
            anyError(error, next);
        }
    }

    reviews = async (req, res, next) => {
        try {
            let reviews = await Review.aggregate([
                { $match: { userId: new mongoose.Types.ObjectId(req.uid) } },
                { $lookup: { from: 'hotels', localField: 'hotelId', foreignField: '_id', as: 'hotel' } }
            ]).exec()

            reviews = reviews.map(review => {
                return {
                    _id: review._id,
                    userId: review.userId,
                    hotelId: review.hotelId,
                    rating: review.rating,
                    comments: review.comments,
                    hotel: review.hotel[0],
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    _v: review._v,
                }
            })

            res.json(reviews)
        } catch (error) {
            anyError(error, next)
        }
    }
    bookings = async (req, res, next) => {
        try {
            const orders = await Booking.find({ userId: req.uid }).exec()

            let result = []

            for (let order of orders) {
                let details = await Booking.aggregate([
                    { $match: { BookingId: new mongoose.Types.ObjectId(order._id) } },
                    { $lookup: { from: 'hotels', localField: 'hotelId', foreignField: '_id', as: 'hotel' } }
                ]).exec()
                details = details.map(detail => {
                    return {
                        _id: detail._id,
                        hotelId: detail.hotelId[0],
                        roomId: detail.roomId[0],
                        BookingId: detail.BookingId,
                        checkInDate: detail.checkInDate,
                        checkOutDate: detail.checkOutDate,
                        guests: detail.guests,
                        roomPrice: detail.roomPrice,
                        totalPrice: detail.totalPrice,
                        createdAt: detail.createdAt,
                        updatedAt: detail.updatedAt,
                        __v: detail.__v
                    }
                })

                result.push({
                    _id: order._id,
                    userId: order.userId,
                    details: details,
                    cardNumber: order.paymentDetails[0],
                    expirationDate: order.paymentDetails[1],
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    __v: order.__v
                })

            }
            res.json(result)

        } catch (error) {
            anyError(error, next)
        }
    }

    rating = async (req, res, next) => {
        try {
            const { comments, rating } = req.body

            await Review.create({ comments, rating, userId: req.uid, hotelId: req.params.id })

            res.json({
                success: 'Thankyou for your review.'
            })
        } catch (error) {
            anyError(error, next)
        }
    }

    checkout = async (req, res, next) => {
        try {
            const order = await Booking.create({ userId: req.uid })

            const { roomId, BookingId, roomPrice, totalPrice, checkInDate, checkOutDate, hotelId, paymentDetails, guests } = req.body
            const numberOfDays = getNumberOfDays(checkInDate, checkOutDate)

            for (let id in req.body) {
                await OrderDetails.create({
                    BookingId: BookingId,
                    hotelId: hotelId,
                    roomId: roomId,
                    paymentDetails: paymentDetails,
                    guests: guests,
                    checkInDate:checkInDate,
                    checkOutDate:checkOutDate,
                    roomPrice: roomPrice,
                    totalPrice: totalPrice,
                    numberOfDays: numberOfDays,
                })
            }

            res.json({
                success: 'Thank you for your order. It is currently being processed.'
            })
        } catch (error) {
            anyError(error, next)
        }
    }
}

export default new ProfileController