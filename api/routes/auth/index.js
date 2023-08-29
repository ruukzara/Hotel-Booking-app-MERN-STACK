import express from "express"
import  { Auth } from "../../controllers/index.js"

const router = express.Router()

router.post('/register', Auth.register)

router.post('/login', Auth.login)

export default router