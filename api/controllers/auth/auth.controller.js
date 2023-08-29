import bcrypt from "bcryptjs"
import { User } from "../../models/index.js"
import { anyError } from "../../lib/index.js"
import jwt from 'jsonwebtoken';

class AuthController {
    register = async (req, res, next) => {
        try {
            const { name, email, password, confirm_password, address, phone } = req.body

            if (password == confirm_password) {

                const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))


                await User.create({ name, email, password: hash, confirm_password: hash, address, phone })

                res.json({
                    success: "Thankyou for registering. Please login to access your account.",
                    status: 201,
                })
            } else {
                next({
                    message: 'Password not confirmed.',
                    status: 422,
                })
            }
        } catch (error) {
            anyError(error, next)
        }
    }

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email }).exec()

            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    if (user.status) {

                        const token = jwt.sign({ id: user._id, iat: Math.floor(Date.now() / 1000) - 30, exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) }, process.env.JWT_SECRET)

                        res.json({ token, user })
                    } else {
                        next({
                            message: 'Inactive account.',
                            status: 422,
                        })
                    }
                } else {
                    next({
                        message: 'Incorrect password',
                        status: 422,
                    })
                }
            } else {
                next({
                    message: 'Given email is  unregistered.',
                    status: 422,
                })
            }
        } catch (error) {
            anyError(error, next)
        }
    }
}

export default new AuthController