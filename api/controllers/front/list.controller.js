import { Brand, Category, Hotel } from "../../models/index.js"

class ListController {
    categories = async (req, res, next) => {
        try {
            const categories = await Category.find({ status: true }).exec()

            res.json(categories)
        } catch (error) {
            anyError(error, next)
        }
    }

    categoryById = async(req, res, next) => {
        try {
            const category = await Category.findById(req.params.id).exec()

            res.json(category)
        } catch (error) {
            anyError(error, next)
        }
    }
    brands = async (req, res, next) => {
        try {
            const brands = await Brand.find({ status: true }).exec()

            res.json(brands)
        } catch (error) {
            anyError(error, next)
        }
    }

    brandById = async (req, res, next) => {
        try {
            const brand = await Brand.findById(req.params.id).exec()

            res.json(brand)
        } catch (error) {
            anyError(error, next)
        }
    }
    
}

export default new ListController


