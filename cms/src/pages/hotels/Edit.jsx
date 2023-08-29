import React, { useEffect, useState } from "react"
import "./index.css"
import { Loading, SubmitButton } from "../../components"
import http from "../../http"
import Switch from "react-switch"
import { useNavigate, useParams } from "react-router-dom"
import slugify from 'slugify'
import { imgUrl, isNull } from "../../lib"


export const Edit = () => {
    const [loginForm, setLoginForm] = useState({ status: true, featured: true })
    const [loading, setLoading] = useState(false)
    const [loadingHotel, setLoadingHotel] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [rooms, setRooms] = useState([])
    const [hotel, setHotel] = useState({ hotelImages: [] })

    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        setLoadingPage(true)
        http.get('/cms/categories')
            .then(({ data }) => {
                setCategories(data)
                return http.get('/cms/brands')
            })
            .then(({ data }) => {
                setBrands(data)
                return http.get(`cms/hotels/${params.id}`)
            })
            .then(({ data }) => setHotel(data))
            .catch(error => { })
            .finally(() => setLoadingPage(false))
    }, [])

    useEffect(() => {
        if (!isNull(hotel)) {
            setLoginForm({
                name: hotel.name,
                slug: hotel.slug,
                description: hotel.description,
                address: hotel.address,
                distance: hotel.distance,
                city: hotel.city,
                country: hotel.country,
                amenities: hotel.amenities,
                price: hotel.price,
                Discounted_Price: hotel.Discounted_Price,
                /* roomId: hotel.roomId, */
                categoryId: hotel.categoryId,
                brandId: hotel.brandId,
                roomImages: hotel.roomImages,
                hotelImages: hotel.hotelImages,
                breakfastIncluded: hotel.breakfastIncluded,
                pool: hotel.pool,
                freeCancellation: hotel.freeCancellation,
                noPrepayment: hotel.noPrepayment,
                airportPickup: hotel.airportPickup,
                createdAt: hotel.createdAt,
                updatedAt: hotel.updatedAt,
                featured: hotel.featured,
                status: hotel.status,
            })
        }
    }, [hotel])

/*     useEffect(() => {
        if (rooms.length) {
            setLoginForm({
                ...loginForm,
                roomId: rooms._id
            })
        }
    }, [rooms]) */

    useEffect(() => {
        if (categories.length) {
            setLoginForm({
                ...loginForm,
                categoryId: categories._id
            })
        }
    }, [categories])

    useEffect(() => {
        if (brands.length) {
            setLoginForm({
                ...loginForm,
                brandId: brands._id
            })
        }
    }, [brands])

    useEffect(() => {
        setLoadingHotel(true);
        http.get('cms/rooms')
            .then(({ data }) => setRooms(data))
            .catch(error => { })
            .finally(() => setLoadingHotel(false));
    }, [setRooms, setLoginForm]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (/* name === 'roomId' || */ name === 'brandId') {
            const fieldValue = value === 'None' ? null : value;
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                [name]: fieldValue,
            }))
        } else {
            setLoginForm((prevLoginForm) => {
                if (prevLoginForm.hasOwnProperty(name)) {
                    return {
                        ...prevLoginForm,
                        [name]: value,
                    };
                } else {
                    return {
                        ...prevLoginForm,
                        [name]: value,
                    };
                }
            });
        }
    };


    const handleInChange = (event) => {
        const { name, value } = event.target;
        setLoginForm(prevLoginForm => ({
            ...prevLoginForm,
            [name]: value
        }));
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        const formData = new FormData();

        for (let key in loginForm) {
            formData.append(key, loginForm[key]);
        }

        // Append hotelImages to formData
        hotelImages.forEach((file, index) => {
            formData.append('hotelImages', file);
        });

        // Append roomImages to formData
        roomImages.forEach((file, index) => {
            formData.append('roomImages', file);
        });

        http
            .patch(`/cms/hotels/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => navigate('/cms/hotels'))
            .catch((err) => { })
            .finally(() => setLoading(false));
    };


    const handleSwitch = () => {
        setLoginForm({
            ...loginForm,
            status: !loginForm.status
        })
    }
    const handleSwitchTwo = () => {
        setLoginForm({
            ...loginForm,
            featured: !loginForm.featured
        })
    }

    useEffect(() => {
        if (loginForm.name) {
            setLoginForm(prevForm => ({
                ...prevForm,
                slug: slugify(loginForm.name)
            }));
        }
    }, [loginForm.name]);

    // const optionsRoom = rooms.map((room) => ({
    //     label: room.title,
    //     value: room._id,
    // }));

    const optionsCategory = categories.map((category) => ({
        label: category.name,
        value: category._id,
    }));

    const optionsBrand = brands.map((brand) => ({
        label: brand.name,
        value: brand._id,
    }));

    const [hotelImages, setHotelImages] = useState([]);
    const [roomImages, setRoomImages] = useState([]);

    const handleFileChange = (ev, imageType) => {
        let files = [];

        for (let file of ev.target.files) {
            files.push(file);
        }

        if (imageType === 'hotelImages') {
            setHotelImages([...hotelImages, ...files]); // Append new files to existing images
        } else if (imageType === 'roomImages') {
            setRoomImages([...roomImages, ...files]); // Append new files to existing images
        }
    };


    const handleImgDel = (filename) => {
        setLoadingPage(true)

        http.delete(`cms/hotels/${params.id}/${filename}`)
            .then(() => http.get(`cms/hotels/${params.id}`))
            .then(({ data }) => setHotel(data))
            .catch(err => { })
            .finally(() => setLoadingPage(false))
    }

    const handleBoxChange = (e) => {
        const { name, checked } = e.target;
        setLoginForm((prevData) => ({
            ...prevData,
            [name]: checked,
        }));
    };

    useEffect(() => {
        if (loginForm.name) {
            setLoginForm(prevForm => ({
                ...prevForm,
                slug: slugify(loginForm.name)
            }));
        }
    }, [loginForm.name]);

    return <div className="edit-hotel-login-form">
        <h2 className="create-hotel-label"> Edit Hotel </h2>
        {loadingPage ? <Loading /> : <>
            <form className="create-hotel-form" onSubmit={handleSubmit}>
                <div className="name-input">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" onChange={handleChange} defaultValue={loginForm.name} />
                </div>
                <div className="name-input-1">
                    <label htmlFor="slug">Slug:</label>
                    <input type="text" id="slug" name="slug" defaultValue={loginForm.slug} onChange={handleInChange} />
                </div>
                <div className="name-input-2">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        type="text" name="description"  wrap="hard" id="description" defaultValue={loginForm.description} onChange={handleChange}
                    />
                </div>
                <div className="name-input">
                    <label htmlFor="distance">Distance: </label>
                    <input type="text" id="distance" name="distance" defaultValue={loginForm.distance} onChange={handleChange} />
                </div>
                <div className="name-input">
                    <label htmlFor="address">Address: </label>
                    <input type="text" id="address" name="address" defaultValue={loginForm.address} onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="city">City: </label>
                    <input type="text" id="city" name="city" value={loginForm.city} onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="country">Country: </label>
                    <input type="text" id="country" name="country" value={loginForm.country} onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="amenities">Amenities: </label>
                    <input type="text" id="amenities" name="amenities" value={loginForm.amenities} onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="price">Price: </label>
                    <input type="text" id="price" name="price" value={loginForm.price} onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="Discounted_Price">Discounted Price: </label>
                    <input type="text" id="Discounted_Price" value={loginForm.Discounted_Price} name="Discounted_Price" onChange={handleChange} />
                </div>
                <div className="image-input">
                    <label htmlFor="hotelImages">Hotel Images: </label>
                    <input
                        className="field-input"
                        type="file"
                        name="hotelImages"
                        id="hotelImages"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'hotelImages')}
                        multiple
                    />
                    {'files' in loginForm ? (
                        <div className="image-preview-container">
                            <div className="image-preview">
                                {loginForm.files.map((file, i) => (
                                    <div key={i} className="image-file-upload">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Image${i}`}
                                            style={{ height: "60px", width: "100px" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>) : null
                    }
                    <div className="image-preview-container">
                        <div className="image-preview">
                            { hotel.hotelImages?.map((image, i) => (
                                <div key={i} className="image-file-upload">
                                    <img src={imgUrl(image)} alt={`Image${i}`} style={{ height: "60px", width: "100px" }} />
                                    <button className="fa-delete-button" onClick={() => handleImgDel(image)} >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="image-input">
                    <label htmlFor="roomImages">Room Images: </label>
                    <input
                        className="field-input"
                        type="file"
                        name="roomImages"
                        id="roomImages"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'roomImages')}
                        multiple
                    />
                    {'files' in loginForm ? (
                        <div className="image-preview-container">
                            <div className="image-preview">
                                {loginForm.files.map((file, i) => (
                                    <div key={i} className="image-file-upload">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Image${i}`}
                                            style={{ height: "60px", width: "100px" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>) : null
                    }
                    <div className="image-preview-container">
                        <div className="image-preview">
                            { hotel.roomImages?.map((image, i) => (
                                <div key={i} className="image-file-upload">
                                    <img src={imgUrl(image)} alt={`Image${i}`} style={{ height: "60px", width: "100px" }} />
                                    <button className="fa-delete-button" onClick={() => handleImgDel(image)} >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* <div className="room-input category-input">
                    <label className="roomId" htmlFor="roomId"> Rooms: </label>
                    <select id="roomId" className="room-select" name="roomId" value={loginForm.roomId} defaultValue={loginForm.roomId} onChange={handleChange} >
                        {optionsRoom.map((room) => (
                            <option key={room.value} value={room.value}>{room.label}</option>
                            ))}
                            <option value="None">None</option>
                    </select>
                </div> */}
                <div className="category-input">
                    <label className="categoryId" htmlFor="categoryId"> Categories: </label>
                    <select id="categoryId" className="category-select" name="categoryId" value={loginForm.categoryId} defaultValue={loginForm.categoryId} onChange={handleChange} required>
                        {optionsCategory.map((category) => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                    </select>
                </div>
                <div className="category-input">
                    <label className="brandId" htmlFor="brandId"> Brands: </label>
                    <select id="brandId" className="brand-select" name="brandId" defaultValue={loginForm.brandId} value={loginForm.brandId} onChange={handleChange} >
                        <option value="None">None</option>
                        {optionsBrand.map((brand) => (
                            <option key={brand.value} value={brand.value}>{brand.label}</option>
                        ))}
                    </select>
                </div>
                <div style={{ textAlign: "start" }}>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="breakfastIncluded">
                            Breakfast Included
                        </label>
                        <input type="checkbox" className="form-checkbox" id="breakfastIncluded" name="breakfastIncluded" value={loginForm.breakfastIncluded} defaultChecked={loginForm.breakfastIncluded} checked={loginForm.breakfastIncluded} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="pool">  pool  </label>
                        <input type="checkbox" className="form-checkbox" id="pool" name="pool" value={loginForm.pool} defaultChecked={loginForm.pool} checked={loginForm.pool} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="freeCancellation"> Free Cancellation </label>
                        <input type="checkbox" className="form-checkbox" id="freeCancellation" name="freeCancellation" value={loginForm.freeCancellation} defaultChecked={loginForm.freeCancellation} checked={loginForm.freeCancellation} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="noPrepayment"> No Prepayment </label>
                        <input type="checkbox" className="form-checkbox" id="noPrepayment" name="noPrepayment" value={loginForm.noPrepayment} defaultChecked={loginForm.noPrepayment} checked={loginForm.noPrepayment} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="airportPickup"> Airport Pickup </label>
                        <input type="checkbox" className="form-checkbox" id="airportPickup" name="airportPickup" value={loginForm.airportPickup} defaultChecked={loginForm.airportPickup} checked={loginForm.airportPickup} onChange={handleBoxChange}
                        />
                    </div>
                </div>
                <div className="switch-block">
                    <div className="switch-container-1">
                        <label htmlFor="switch" className="switch-label">Status:</label>
                        <div className="switch-react">
                            <span className="status-label-1">Active</span>
                            <div className="switch-label-1"><Switch height={24} checked={loginForm.status} onChange={handleSwitch} value={loginForm.status} offColor="#00001a" /> </div>
                            <span className="status-label">Inactive</span>
                        </div>
                    </div>
                    <div className="switch-container-2">
                        <label htmlFor="switch" className="switch-label-0">Featured:</label>
                        <div className="switch-react-1">
                            <span className="status-label-0">Yes</span>
                            <div className="switch-label-2"><Switch height={24} value={loginForm.featured} checked={loginForm.featured} onChange={handleSwitchTwo} offColor="#f03131" /></div>
                            <span className="status-label-2">No</span>
                        </div>
                    </div>
                </div>
                <div>
                    <SubmitButton disabled={loading} />
                </div>
            </form>
        </>
        }
    </div >
} 
