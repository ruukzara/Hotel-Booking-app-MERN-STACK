import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { imgUrl, isNull, setInState } from "../../lib";
import { Loading, SubmitButton } from "../../components";
import http from "../../http";
import { addUser } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "react-switch";
import slugify from "slugify";

export const Edit = () => {
    const [category, setCategory] = useState({});
    const [loginForm, setLoginForm] = useState({ status: true });
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [hotel, setHotel] = useState({ hotelImages: [] });

    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoadingPage(true);
        http
            .get(`/cms/categories/${params.id}`)
            .then(({ data }) => setCategory(data))
            .catch((error) => { })
            .finally(() => setLoadingPage(false));
    }, []);

    useEffect(() => {
        if (!isNull(category)) {
            setLoginForm({
                name: category.name,
                slug: category.slug,
                status: category.status,
            });
            setHotel({ hotelImages: category.hotelImages });
        }
    }, [category]);

    useEffect(() => {
        if (loginForm && loginForm.name) {
            setLoginForm((prevForm) => ({
                ...prevForm,
                slug: slugify(prevForm.name),
            }));
        }
    }, [loginForm.name]);

    const handleChange = (ev) => setInState(ev, loginForm, setLoginForm);

    const handleSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        setLoginForm((loginForm) => ({
            ...loginForm,
            categoryId: loginForm.categoryId,
        }));

        const fd = new FormData();

        for (let k in loginForm) {
            if (k === "files") {
                for (let file of loginForm.files) {
                    fd.append("files", file);
                }
            } else {
                fd.append(k, loginForm[k]);
            }
        }

        http.patch(`/cms/categories/${params.id}`, fd, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => navigate("/cms/categories"))
            .catch((err) => { })
            .finally(() => setLoading(false));
    };

    const handleSwitch = () => {
        setLoginForm({
            ...loginForm,
            status: !loginForm.status,
        });
    };

    const handleFileChange = ev => {
        let files = []

        for (let file of ev.target.files) {
            files.push(file)
        }
        setLoginForm({
            ...loginForm,
            files,
        })
    }

    const handleImgDel = (filename) => {
        setLoadingPage(true);

        http
            .delete(`cms/categories/${params.id}/${filename}`)
            .then(() => http.get(`cms/categories/${params.id}`))
            .then(({ data }) => setHotel(data))
            .catch((err) => { })
            .finally(() => setLoadingPage(false))
    }

    return (
        <div className="edit-category-login-form">
            <h2 className="edit-category-label">Edit-category</h2>
            {loadingPage ? (
                <Loading />
            ) : (
                <form className="edit-category-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={loginForm.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="slug">Slug:</label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            defaultValue={loginForm.slug}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="image-input">
                        <label htmlFor="files">Images: </label>
                        <input className="field-input" type="file" name="files" id="files" accept="images/*" onChange={handleFileChange} />
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
                                {hotel.hotelImages && hotel.hotelImages.map((image, i) => (
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

                    <div className="category-switch-container">
                        <label htmlFor="switch" className="switch-label">
                            Status:
                        </label>
                        <div className="switch-react">
                            <span className="category-status-label-1">Inactive</span>
                            <Switch
                                height={24}
                                checked={loginForm.status}
                                onChange={handleSwitch}
                                offColor="#00001a"
                            />
                            <span className="category-status-label-2">Active</span>
                        </div>
                    </div>

                    <SubmitButton loading={loading} />
                </form>
            )}
        </div>
    );
};
