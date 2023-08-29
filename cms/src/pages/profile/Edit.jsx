import { useEffect, useState } from "react"
import "./index.css"
import { useDispatch, useSelector } from "react-redux"
import { isNull, setInState } from "../../lib"
import { SubmitButton } from "../../components"
import http from "../../http"
import { addUser } from "../../store"

export const Edit = () => {
    const [loginForm, setLoginForm] = useState({})
    const [loading, setLoading] = useState(false)

    const user = useSelector(st => st.user.value)

    const dispatch = useDispatch()

    useEffect(() => {
        if (!isNull(user)) {
            setLoginForm({
                name: user.name,
                phone: user.phone,
                address: user.address,
            })
        }

    }, [user])

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch('/profile/edit-profile', loginForm)
            .then(resp => http.get('/profile/details'))
            .then(({ data }) => dispatch(addUser(data)))
            .catch(err => { })
            .finally(() => setLoading(false))
    }

    return <div className="edit-login-form">
        <h2 className="edit-label">Edit-Profile</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" defaultValue={loginForm.name} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="text" id="email" name="email" defaultValue={user.email} onChange={handleChange} disabled style={{ border: "none" }} />
            </div>
            <div>
                <label htmlFor="phone">Phone:</label>
                <input type="text" id="phone" name="phone" defaultValue={loginForm.phone} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" name="address" defaultValue={loginForm.address} onChange={handleChange} />
            </div>
            <SubmitButton disabled={loading} />
        </form>

    </div>
}
