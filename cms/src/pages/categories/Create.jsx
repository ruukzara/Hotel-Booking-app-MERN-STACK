import React, { useEffect, useState } from "react"
import "./index.css"
import { setInState } from "../../lib"
import { SubmitButton } from "../../components"
import http from "../../http"
import Switch from "react-switch"
import { useNavigate } from "react-router-dom"
import slugify from 'slugify'

export const Create = () => {
    const [loginForm, setLoginForm] = useState({ status: true })
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate()

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const formData = new FormData();
    for (let key in loginForm) {
        if (key === "files") {
            loginForm.files.forEach((file) => {
                formData.append("files", file);
            });
        } else {
            formData.append(key, loginForm[key]);
        }
    }

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.post('/cms/categories', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(() => {
                navigate('/cms/categories')
            })
            .catch(err => { })
            .finally(() => setLoading(false))
    }

    const handleSwitch = () => {
        setLoginForm({
            ...loginForm,
            status: !loginForm.status
        })
    }

    useEffect(() => {
        if (loginForm && loginForm.name) {
            setLoginForm(prevForm => ({
                ...prevForm,
                slug: slugify(prevForm.name)
            }))
        }
    }, [loginForm.name])

    const handleFileChange = ev => {
        let files = [];

        for (let file of ev.target.files) {
            files.push(file);
        }
        setLoginForm({
            ...loginForm,
            files,
        });
    };

    return <div className="create-login-form">
        <h2 className="create-label">Add Category</h2>
        <form className="create-form" onSubmit={handleSubmit}>
            <div className="name-input">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={handleChange} required />
            </div>
            <div className="name-input-1">
                <label htmlFor="slug">Slug:</label>
                <input type="text" id="slug" name="slug" value={loginForm.slug} onChange={handleChange} required />
            </div>
            <div className="image-input">
                <label htmlFor="files">Images: </label>
                <input className="field-input" type="file" name="files" id="files" accept="images/*" onChange={handleFileChange} multiple />
                {'files' in loginForm ? (
                    <div className="image-preview-container">
                        <div className="image-preview">
                            {loginForm.files.map((file, i) => (
                                <div key={i} className="image-file-upload">
                                    <img src={URL.createObjectURL(file)} alt={`Image${i}`} style={{ height: "60px", width: "100px" }} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
            <div className="switch-block-2">
                <div className="switch-container-1">
                    <label htmlFor="switch" className="switch-label">Status:</label>
                    <div className="switch-react">
                        <span className="status-label-1">Active</span>
                        <div className="switch-label-1"><Switch height={24} checked={loginForm.status} onChange={handleSwitch} offColor="#00001a" /> </div>
                        <span className="status-label">Inactive</span>
                    </div>
                </div>
            </div>
            <div>
                <SubmitButton disabled={loading} />
            </div>
        </form>

    </div>
} 
