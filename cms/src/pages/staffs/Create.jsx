import React, { useState } from "react"
import "./index.css"
import { setInState } from "../../lib"
import { SubmitButton } from "../../components"
import http from "../../http"
import Switch from "react-switch"
import { useNavigate } from "react-router-dom"

export const Create = () => {
    const [loginForm, setLoginForm] = useState({status: true})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.post('/cms/staffs', loginForm)
            .then(() => navigate('/cms/staffs'))
            .catch(err => { })
            .finally(() => setLoading(false))
    }

    const handleSwitch = () => {
        setLoginForm({
            ...loginForm,
            status: !loginForm.status
        })
    }

    return <div className="create-login-form">
        <h2 className="create-label">Add Staff</h2>
        <form className="create-form" onSubmit={handleSubmit}>
            <div className="name-input">
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" onChange={handleChange} required />
            </div>
            <div className="email-input">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" onChange={handleChange} required />
            </div>
            <div className="password-input">
                <label htmlFor="new_password"> Password</label>
                <input type="password" id="password" name="password" onChange={handleChange} required />
            </div>
            <div className="password-input">
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" onChange={handleChange} required />
            </div>
            <div className="name-input">
                <label htmlFor="phone">Phone:</label>
                <input type="text" id="phone" name="phone" onChange={handleChange} required />
            </div>
            <div className="name-input">
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" name="address" onChange={handleChange} required />
            </div>
            <div className="switch-container">
                <label htmlFor="switch" className="switch-label">Status:</label>
                <div className="switch-react">
                    <span className="status-label-1">Inactive</span>
                    <div className="label-switch"><Switch height={24} checked={loginForm.status} onChange={handleSwitch} offColor="#00001a" /></div>
                    <span className="status-label">Active</span>
                </div>
            </div>
            <div>
                <SubmitButton disabled={loading} />
            </div>
        </form>

    </div>
} 
