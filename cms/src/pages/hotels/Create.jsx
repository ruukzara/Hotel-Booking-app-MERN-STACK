import React, { useEffect, useState } from "react"
import "./index.css"
import { Loading, SubmitButton } from "../../components"
import http from "../../http"
import Switch from "react-switch"
import { useNavigate } from "react-router-dom"
import slugify from 'slugify'


export const Create = () => {
    const [loginForm, setLoginForm] = useState({ status: true, featured: false, hotelImages: [], roomImages: [] })
    const [loading, setLoading] = useState(false)
    const [loadingHotel, setLoadingHotel] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)
    const [categories, setCategories] = useState([])
    const [brands, setBrands] = useState([])
    const [rooms, setRooms] = useState([])

    const navigate = useNavigate()

    useEffect(() => {
        setLoadingPage(true)
        http.get('/cms/categories')
            .then(({ data }) => {
                setCategories(data)
                return http.get('/cms/brands')
            })
            .then(({ data }) => {
                setBrands(data)
            })
            .catch(error => { })
            .finally(() => setLoadingPage(false))
    }, [])

    useEffect(() => {
        setLoadingHotel(true)
        http.get('cms/rooms')
            .then(({ data }) => {
                setRooms(data)
            })
            .catch((error) => { })
            .finally(() => setLoadingHotel(false))
    }, [])

    useEffect(() => {
        if (categories.length) {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                categoryId: categories[0]._id
            }));
        }

        if (brands.length) {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                brandId: brands[0]._id
            }));
        }

        if (rooms.length) {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                roomId: rooms[0]._id
            }));
        }
    }, []);


    useEffect(() => {
        if (loginForm.name) {
            setLoginForm(prevForm => ({
                ...prevForm,
                slug: slugify(loginForm.name)
            }));
        }
    }, [loginForm.name]);


    const handleChange = (event) => {
        const { name, value } = event.target; // Use event.target to get the input value
        if (name === 'roomId') {
            const selectedRoomId = value === 'None' ? null : value;
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                roomId: selectedRoomId,
            }));
        } else {
            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                [name]: value,
            }))
        }
    }

    const handleInChange = (event) => {
        const { name, value } = event.target; // Use event.target to get the input value
        setLoginForm((prevLoginForm) => ({
            ...prevLoginForm,
            [name]: value, // Update the value of the input field
        }))
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        const formData = new FormData();

        // Append the selectedHotelImages and selectedRoomImages to formData
        loginForm.files.forEach((file) => {
            formData.append(file.fieldname, file.file);
        });

        // Append the rest of the form data
        for (let key in loginForm) {
            if (key !== "hotelImages" && key !== "roomImages") {
                formData.append(key, loginForm[key]);
            }
        }

        http.post("/cms/hotels", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(() => {
                navigate("/cms/hotels")
            })
            .catch((err) => {

            })
            .finally(() => setLoading(false));
    }


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

    const optionsRoom = rooms.map((room) => ({
        label: room.title,
        value: room._id,
    }));

    const optionsCategory = categories.map((category) => ({
        label: category.name,
        value: category._id,
    }));

    const optionsBrand = brands.map((brand) => ({
        label: brand.name,
        value: brand._id,
    }));

    const addNoneOption = true; // Set this based on your condition

    const updatedOptionsBrand = addNoneOption ? [{ value: '', label: 'None' }, ...optionsBrand] : optionsBrand;

    const updatedOptionsRoom = addNoneOption ? [{ value: '', label: 'None' }, ...optionsRoom] : optionsRoom;

    const handleFileChange = (e) => {
        const { name, files } = e.target;


        if (files.length > 0) {
            const imageFiles = Array.from(files).map((file) => ({ fieldname: name, file }));

            setLoginForm((prevLoginForm) => ({
                ...prevLoginForm,
                files: [...(prevLoginForm.files || []), ...imageFiles],
            }));
        }
    };


    const handleBoxChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
            setLoginForm((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setLoginForm((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    return <div className="create-hotel-login-form">
        <h2 className="create-hotel-label"> Add Hotel </h2>
        {loadingPage ? <Loading /> :
            <form className="create-hotel-form" onSubmit={handleSubmit} encType="multipart/form-data" >
                <div className="name-input">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" onChange={handleChange} required />
                </div>
                <div className="name-input-1">
                    <label htmlFor="slug">Slug:</label>
                    <input type="text" id="slug" name="slug" value={loginForm.slug} onChange={handleInChange} required />
                </div>
                <div className="name-input-2">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        type="text"
                        name="description"
                        id="description"
                        wrap="hard"
                        value={loginForm.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="name-input">
                    <label htmlFor="distance">Distance: </label>
                    <input type="text" id="distance" name="distance" onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="address">Address: </label>
                    <input type="text" id="address" name="address" onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="city">City: </label>
                    <input type="text" id="city" name="city" onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="country">Country: </label>
                    <input type="text" id="country" name="country" onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="amenities">Amenities: </label>
                    <input type="text" id="amenities" name="amenities" onChange={handleChange} required />
                </div>

                <div className="name-input">
                    <label htmlFor="price">Price: </label>
                    <input type="text" id="price" name="price" onChange={handleChange} required />
                </div>
                <div className="name-input">
                    <label htmlFor="Discounted_Price">Discounted Price: </label>
                    <input type="text" id="Discounted_Price" name="Discounted_Price" onChange={handleChange} required />
                </div>
                <div className="image-input">
                    <label htmlFor="hotelImages">Hotel Images: </label>
                    <input className="field-input" type="file" name="hotelImages" id="hotelImages" accept="images/*" onChange={handleFileChange} multiple required />
                    {'files' in loginForm && loginForm.files.map((file, i) => file.fieldname === 'hotelImages' && (
                        <div key={i} className="image-file-upload">
                            <img src={URL.createObjectURL(file.file)} alt={`Image ${i}`} style={{ height: "60px", width: "100px" }} />
                        </div>
                    ))}
                </div>

                <div className="image-input">
                    <label htmlFor="roomImages">Room Images: </label>
                    <input className="field-input" type="file" name="roomImages" id="roomImages" accept="images/*" onChange={handleFileChange} multiple required />
                    {'files' in loginForm && loginForm.files.map((file, i) => file.fieldname === 'roomImages' && (
                        <div key={i} className="image-file-upload">
                            <img src={URL.createObjectURL(file.file)} alt={`Image ${i}`} style={{ height: "60px", width: "100px" }} />
                        </div>
                    ))}
                </div>

                {/* <div className="room-input category-input">
                    <label className="roomId" htmlFor="roomId"> Rooms: </label>
                    <select id="roomId" className="room-select" name="roomId" value={loginForm.roomId} onChange={handleChange} multiple >
                        {updatedOptionsRoom.map((room) => (
                            <option key={room.value} value={room.value}>{room.label}</option>
                        ))}
                    </select>
                </div> */}
                <div className="category-input">
                    <label className="categoryId" htmlFor="categoryId"> Categories: </label>
                    <select id="categoryId" className="category-select" name="categoryId" value={loginForm.categoryId} onChange={handleChange} required>
                        {optionsCategory.map((category) => (
                            <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                    </select>
                </div>
                <div className="category-input">
                    <label className="brandId" htmlFor="brandId"> Brands: </label>
                    <select id="brandId" className="brand-select" name="brandId" value={loginForm.brandId} onChange={handleChange} >
                        {updatedOptionsBrand.map((brand) => (
                            <option key={brand.value} value={brand.value}>{brand.label}</option>
                        ))}
                    </select>
                </div>
                <div className="switch-block">
                    <div className="switch-container-1">
                        <label htmlFor="switch" className="switch-label">Status:</label>
                        <div className="switch-react">
                            <span className="status-label-1">Active</span>
                            <div className="switch-label-1"><Switch height={24} checked={loginForm.status} onChange={handleSwitch} offColor="#00001a" /> </div>
                            <span className="status-label">Inactive</span>
                        </div>
                    </div>
                    <div className="switch-container-2">
                        <label htmlFor="switch" className="switch-label-0">Featured:</label>
                        <div className="switch-react-1">
                            <span className="status-label-0">Yes</span>
                            <div className="switch-label-2"><Switch height={24} checked={loginForm.featured} onChange={handleSwitchTwo} offColor="#f03131" /></div>
                            <span className="status-label-2">No</span>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: "start" }}>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="breakfastIncluded"> Breakfast Included </label>
                        <input type="checkbox" className="form-checkbox" id="breakfastIncluded" name="breakfastIncluded" checked={loginForm.breakfastIncluded} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="pool">  pool  </label>
                        <input type="checkbox" className="form-checkbox" id="pool" name="pool" checked={loginForm.pool} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="freeCancellation"> Free Cancellation </label>
                        <input type="checkbox" className="form-checkbox" id="freeCancellation" name="freeCancellation" checked={loginForm.freeCancellation} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="noPrepayment"> No Prepayment </label>
                        <input type="checkbox" className="form-checkbox" id="noPrepayment" name="noPrepayment" checked={loginForm.noPrepayment} onChange={handleBoxChange}
                        />
                    </div>
                    <div className="checkbox-input">
                        <label className="form-label" htmlFor="airportPickup"> Airport Pickup </label>
                        <input type="checkbox" className="form-checkbox" id="airportPickup" name="airportPickup" checked={loginForm.airportPickup} onChange={handleBoxChange}
                        />
                    </div>
                </div>

                <div>
                    <SubmitButton disabled={loading} />
                </div>
            </form>}
    </div>
} 
