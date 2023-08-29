import { anyError } from '../../lib/index.js'
import { User } from '../../models/index.js'
import bcrypt from 'bcryptjs'

class StaffsController {
    index = async (req, res, next) => {
        try {
            const staffs = await User.find({ role: 'staff' }).exec()

            res.json(staffs)

        } catch (err) {
            anyError(err, next)
        }
    }


    store = async (req, res, next) => {
        try {
            const { name, email, password, confirm_password, address, phone, status } = req.body

            if (password == confirm_password) {
                const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

                await User.create({ name, email, password: hash, confirm_password: hash, address, phone, role: 'staff', status })

                res.json({
                    success: 'Staff added.'
                })
            } else {
                next({
                    message: 'Password not confirmed.',
                    status: 422,
                })
            }
        } catch (err) {
            anyError(err, next)
        }
    }


    show = async (req, res, next) => {
        try {
            const staff = await User.findById(req.params.id)

            res.json(staff)
        } catch (err) {
            anyError(err, next)
        }
    }

    update = async (req, res, next) => {
        try {
            const { name, address, phone, status } = req.body

            await User.findByIdAndUpdate(req.params.id, { name, address, phone, status })

            res.json({
                success: 'Staff Updated.'
            })
        } catch {
            anyError(err, next)
        }
    }

    destroy = async (req, res, next) => {
        try {
            await User.findByIdAndDelete(req.params.id)

            res.json({
                success: 'Staff removed.'
            })
        } catch (err){
            anyError(err, next)
        }
    }
}

export default new StaffsController 