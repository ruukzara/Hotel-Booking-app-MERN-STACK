import express from "express"
import cmsRoutes from "./cms/index.js"
import authRoutes from "./auth/index.js"
import frontRoutes from "./front/index.js"
import profileRoutes from "./profile/index.js"
import { UserOnly, auth } from "../lib/index.js"
import { Profile } from "../controllers/index.js"

const router = express.Router()

router.use('/auth', authRoutes)

router.use('/cms', cmsRoutes)

router.use('/profile', auth, profileRoutes)

router.use('/checkout', auth, UserOnly, Profile.checkout)

router.get('/:filename', (req, res, next) => {
    res.sendFile(`uploads/${req.params.filename}`, {
        root:"../api"
    })
})

router.use(frontRoutes)

router.use((req, res, next) => {
    next({
        message: 'Resource not found',
        status: 403
    })
})

export default router