import mongoose, { Types, ObjectId } from "mongoose"
import { anyError } from "../../lib/index.js"
import { Category, Hotel, Review, Room } from "../../models/index.js"

class HotelController {
    byType = async (req, res, next) => {
        try {
            const categoryNames = req.query.categories.split(",").map((category) => category.trim());

            const categoryCounts = await Promise.all(
                categoryNames.map(async (categoryName) => {
                    const category = await Category.findOne({ name: categoryName });

                    const count = await Hotel.countDocuments({ categoryId: category._id });
                    return count;
                })
            );

            res.json(categoryCounts);
        } catch (error) {
            anyError(error, next);
        }
    };

    latest = async (req, res, next) => {
        try {
            const hotels = await Hotel.find({ status: true }).sort({ 'createdAt': 'desc' }).exec()

            res.json(hotels)
        } catch (error) {
            anyError(error, next)
        }
    }

    featured = async (req, res, next) => {
        try {
            const hotels = await Hotel.find({ status: true, featured: true }).sort({ 'createdAt': 'desc' }).exec()
            res.json(hotels)
        } catch (error) {
            anyError(error, next)
        }
    }

    top = async (req, res, next) => {
        try {
            const hotels = await Hotel.aggregate([
                { $match: { status: true } },
                {
                    $lookup: {
                        from: 'OrderDetails', localField: '_id',
                        foreignField: 'hotelId', as: 'order_count'
                    }
                },
                { $addFields: { order_count: { $size: '$order_count' } } }
            ]).sort({ order_count: 'desc', createdAt: 'desc' }).exec()

            res.json(hotels)
        } catch (error) {
            anyError(error, next)
        }
    }

    similar = async (req, res, next) => {
        try {
            const hotel = await Hotel.findById(req.params.id)

            const hotels = await Hotel.find({ status: true, categoryId: hotel.categoryId, _id: { $ne: hotel._id } }).exec()

            res.json(hotels)
        } catch (error) {
            anyError(error, next)
        }
    }

    byCategory = async (req, res, next) => {
        try {
            const hotels = await Hotel.find({ status: true, categoryId: req.params.id }).exec()

            res.json(hotels)
        } catch (error) {
            anyError(error, next)
        }
    }

    categories = async (req, res, next) => {
        try {
            const categories = await Category.find({ status: true }).exec()

            res.json(categories)
        } catch (error) {
            anyError(error, next)
        }
    }

    byBrand = async (req, res, next) => {
        try {
            const hotels = await Hotel.find({ status: true, brand_id: req.params.id }).exec()

            res.json(hotels)
        } catch (error) {
            anyError(error, next)
        }
    }


    // Function to retrieve a hotel by its ID
    byId = async (req, res, next) => {
        const { id } = req.params

        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid hotel ID' });
            }

            const hotels = await Hotel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
                { $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' } },
                { $lookup: { from: 'rooms', localField: 'roomId', foreignField: '_id', as: 'room' } },
            ]).exec();

            // Fetch reviews with error handling
            const reviews = await Review.aggregate([
                { $match: { hotelId: new mongoose.Types.ObjectId(id) } }, // Use mongoose.Types.ObjectId
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'user' } },
            ]).exec();

            if (hotels.length === 0) {
                // Return a response indicating that no hotel with the given ID was found
                return res.status(404).json({ error: 'Hotel not found' });
            }

            const hotel = {
                _id: hotels[0]._id,
                name: hotels[0].name,
                description: hotels[0].description,
                address: hotels[0].address,
                distance: hotels[0].distance,
                city: hotels[0].city,
                country: hotels[0].country,
                amenities: hotels[0].amenities,
                rooms: hotels[0].room,
                roomId: hotels[0].roomId,
                hotelImages: hotels[0].hotelImages,
                roomImages: hotels[0].roomImages,
                price: hotels[0].price,
                categoryId: hotels[0].categoryId,
                brandId: hotels[0].brandId,
                featured: hotels[0].featured,
                status: hotels[0].status,
                category: hotels[0].category[0],
                brand: hotels[0].brand[0],
                createdAt: hotels[0].createdAt,
                updatedAt: hotels[0].updatedAt,
                reviews: reviews.map(review => {
                    return {
                        _id: review._id,
                        userId: review.userId,
                        productId: review.productId,
                        rating: review.rating,
                        comment: review.comment,
                        user: review.user[0],
                        _v: review._v,
                    };
                }),
                _v: hotels[0]._v,
            };
            if (hotels.length === 0) {
                // Return a response indicating that no hotel with the given ID was found
                return res.status(404).json({ error: 'Hotel not found' });
            }

            res.json(hotel);
        } catch (error) {
            anyError(error, next);
        }
    }

    byHotelAndRoomId = async (req, res, next) => {
        try {
            const { id, roomId } = req.params;
    
            const hotel = await Hotel.findById(id); // Fetch the hotel by hotelId
            if (!hotel) {
                return res.status(404).json({ message: 'Hotel not found' });
            }
    
            const room = await Room.findById(roomId); // Fetch the room by roomId
            if (!room) {
                return res.status(404).json({ message: 'Room not found' });
            }
    
            res.status(200).json({ hotel, room });
        } catch (error) {
            anyError(error, next);
        }
    };


    // getHotels = async (req, res, next) => {
    //     const { searchTerm, start_date, end_date, adults, rooms, min, max } = req.query;
    
    //     try {
    //         const hotels = await Hotel.aggregate([
    //             {
    //                 $match: {
    //                     status: true,
    //                     name: { $regex: searchTerm, $options: "i" },
    //                     start_date: { $lte: new Date(start_date) },
    //                     end_date: { $gte: new Date(end_date) },
    //                     adults: { $gte: parseInt(adults) },
    //                     rooms: { $gte: parseInt(rooms) },
    //                     price: { $gte: parseInt(min), $lte: parseInt(max) },
    //                 },
    //             },
    //             { $sort: { createdAt: "desc" } },
    //         ]).exec();
    
    //         res.status(200).json(hotels);
    //     } catch (err) {
    //         next(err);
    //     }
    // };
    

    searchCity = async (req, res, next) => {
        try {
            const {city} = req.params;

            const hotels = await Hotel.aggregate([
                {
                    $match: {
                        $or: [
                            { city: { $regex: new RegExp(city, 'i') } },
                            { 'category.name': { $regex: new RegExp(city, 'i') } },
                            { 'brand.name': { $regex: new RegExp(city, 'i') } },
                            { 'room.title': { $regex: new RegExp(city, 'i') } },
                        ],
                    },
                },
                { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' }, },
                { $lookup: { from: 'brands', localField: 'brandId', foreignField: '_id', as: 'brand' }, },
                { $lookup: { from: 'rooms', localField: 'roomId', foreignField: '_id', as: 'room' }, },
            ]).exec();

            res.json(hotels);
        } catch (error) {
            anyError(error, next);
        }
    };

}

export default new HotelController