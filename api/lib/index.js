import jwt from "jsonwebtoken"
import { User } from "../models/index.js"
import multer from "multer"

export const debug = () => {
    if (typeof process !== 'undefined' && process.env) {
        return process.env.DEBUG === 'true' || process.env.DEBUG === true;
    }
    return false;
};

export const anyError = (error, next) => {
    if (debug()) {
        console.error(error)
    }
    next({
        message: 'Problem while processing request',
        status: 400,
    })
}

export const auth = async (req, res, next) => {
    if ("authorization" in req.headers && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ').pop()

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.uid = decoded.id
            req.user = await User.findById(decoded.id)

            next()

        } catch (err) {
            next({
                message: 'Invalid token.',
                status: 401,
            })
        }
    } else {
        next({
            message: 'Token missing.',
            status: 401,
        })
    }
}

export const isUser = (req, res, next) => {
    auth(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.role == "Admin") {
            next()
        } else {
            if (error) {
                return next({
                    message: "You are not authorized.",
                    status: 403,
                })
            }
        }
    })
}

export const adminOnly = (req, res, next) => {
    auth(req, res, next, () => {
        if (req.user.role != 'Admin') {
            next({
                message: 'Access Denied',
                status: 403
            })
        }
        next()
    })
}

export const UserOnly = (req, res, next) => {
    if (req.user.role == 'Admin') {
        next({
            message: 'Access Denied',
            status: 403
        })
    }
    next()
}


export const fileUpload = (mimeTypes = []) => multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads'); // Set the destination folder where files will be stored
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = file.mimetype.split('/')[1]; // Get the file extension from the mimetype
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension); // Set the filename as "fieldname-timestamp.extension"
        },
    }),

    fileFilter: (req, file, callback) => {
        if (mimeTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback({ message: 'File type not supported.' }, false);
        }
    },
})


export const getDatesInRange = (startDate, endDate) => {
    const dates = []
    const currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
        dates.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
}

export const getNumberOfDays = (startDate, endDate) => {
    const currentDate = new Date(startDate);
    const endDateObj = new Date(endDate);
    let count = 0;

    while (currentDate <= endDateObj) {
        count++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return count;
};
