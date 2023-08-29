import express from "express"
import {Cms} from "../../controllers/index.js"
import { adminOnly, isUser } from "../../lib/index.js"

const router = express.Router()

router.route('/')
    .get(Cms.Users.getAllUsers, adminOnly)
router.route('/:id')
    .get( Cms.Users.getUser, isUser)
    .put( Cms.Users.updateUser, isUser)
    .patch( Cms.Users.updateUser, isUser)
    .delete( Cms.Users.deleteUser, isUser)

export default router
