import express from "express"
import { Front } from "../../controllers/index.js"

const router = express.Router()

// router.get('/search', Front.Hotel.getHotels )

// router.get('/search/:id', Front.Hotel.byId )

router.get('/search/city/:city', Front.Hotel.searchCity)

router.get('/brand/all', Front.List.brands)

router.get('/brand/:id', Front.List.brandById)

router.get('/brand/:id/hotels', Front.Hotel.byBrand)

router.get('/category/all', Front.List.categories)

router.get('/category/:id', Front.List.categoryById)

router.get('/category/:id/hotels', Front.Hotel.byCategory)


export default router