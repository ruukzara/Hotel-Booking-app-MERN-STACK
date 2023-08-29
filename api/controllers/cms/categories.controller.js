import { anyError } from '../../lib/index.js'
import { Category } from '../../models/index.js'
import { unlink } from 'node:fs/promises'


class CategoriesController {
    index = async (req, res, next) => {
        try {
            const categories = await Category.find()

            res.json(categories)

        } catch (err) {
            anyError(err, next)
        }
    }

    store = async (req, res, next) => {
        try {
            const { name, slug, status } = req.body

            // Check if files are present in the request
            if (!req.files || req.files.length === 0) {
                throw new Error('No files uploaded.');
            }

            const hotelImages = req.files.map(file => file.filename);

            await Category.create({ name, slug, status, hotelImages  })

            res.json({
                success: 'Category added.'
            })

        } catch (err) {
            anyError(err, next)
        }
    }

    show = async (req, res, next) => {
        try {
            const category= await Category.findById(req.params.id)

            res.json(category)
        } catch {
            anyError(err, next)
        }
    }

    update = async (req, res, next) => {
        try {
            const { name, slug, status } = req.body;
    
            const category = await Category.findById(req.params.id);
    
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
    
            let images;
    
            if (req.files.length) {
                images = [...category.hotelImages, ...req.files.map(file => file.filename)];
            } else {
                images = category.hotelImages;
            }
    
            await Category.findByIdAndUpdate(req.params.id, { name, slug, status, hotelImages: images });
    
            res.json({
                success: 'Category Updated.'
            });
        } catch (err) {
            anyError(err, next);
        }
    };
    

    destroy = async (req, res, next) => {
        try {
            await Category.findByIdAndDelete(req.params.id)

            res.json({
                success: 'Category removed.'
            })
        } catch {
            anyError(err, next)
        }
    }

    image = async (req, res, next) => {
        try {
            const hotel = await Category.findById(req.params.id)

            if (hotel.hotelImages.length > 1) {

                await unlink(`uploads/${req.params.filename}`)

                const hotelImages = hotel.hotelImages.filter(image => image != req.params.filename)

                await Category.findByIdAndUpdate(req.params.id, { hotelImages })

                res.json({
                    message: 'Category image removed.'
                })
            } else {
                next({
                    message: 'At least one image is required in the category.'
                })
            }
        } catch (err) {
           anyError(err, next)
        }
    }
}

export default new CategoriesController 