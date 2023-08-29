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

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.post('/cms/brands', loginForm)
            .then(() => {
                navigate('/cms/brands')
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

    return <div className="create-login-form">
        <h2 className="create-label">Add Brand</h2>
        <form className="create-form" onSubmit={handleSubmit}>
            <div className="name-input">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={handleChange} required />
            </div>
            <div className="name-input-1">
                <label htmlFor="slug">Slug:</label>
                <input type="text" id="slug" name="slug" value={loginForm.slug} onChange={handleChange} required />
            </div>
            <div className="switch-block-1">
                    <div className="switch-container-2">
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
