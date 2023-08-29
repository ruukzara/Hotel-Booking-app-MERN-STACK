import { useState } from "react"
import "./index.css"
import { setInState } from "../../lib"
import { SubmitButton } from "../../components"
import http from "../../http"
import { useNavigate } from "react-router-dom"

export const Password = () => {
    const [passwordForm, setPasswordForm] = useState({})
    const [loading, setLoading] = useState(false)
    const handleChange = ev => setInState(ev, passwordForm, setPasswordForm)

    const navigate = useNavigate()

    const handleSubmit = (ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch('/profile/change-password', passwordForm)
            .then(() => {
                navigate('/login')
                window.location.reload();
            })
            .catch(err => { })
            .finally(() => setLoading(false))
    })

    return <div className="password-login-form">
        <h2 className="password-label">Change Password</h2>
        <form className="password-form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="old_password">Old Password</label>
                <input type="password" id="old_password" name="old_password" onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="new_password">New Password</label>
                <input type="password" id="new_password" name="new_password" onChange={handleChange} required />
            </div>
            <div>
                <label htmlFor="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" onChange={handleChange} required />
            </div>
           
            <SubmitButton disabled={loading} />
        </form>
    </div>
}
