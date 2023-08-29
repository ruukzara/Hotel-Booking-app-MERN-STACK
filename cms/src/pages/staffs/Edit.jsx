import React, { useEffect, useState } from "react"
import "./index.css"
import { useDispatch, useSelector } from "react-redux"
import { isNull, setInState } from "../../lib"
import { Loading, SubmitButton } from "../../components"
import http from "../../http"
import { addUser } from "../../store"
import { useNavigate, useParams } from "react-router-dom"
import Switch from "react-switch"

export const Edit = () => {
    const [staff, setStaff] = useState({})
    const [loginForm, setLoginForm] = useState({ status: true })
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)

    const user = useSelector(st => st.user.value)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setLoadingPage(true)
        http.get(`/cms/staffs/${params.id}`)
            .then(({ data }) => setStaff(data))
            .catch(error => { })
            .finally(setLoadingPage(false))
    }, [])

    useEffect(() => {
        if (!isNull(staff)) {
            setLoginForm({
                name: staff.name,
                phone: staff.phone,
                address: staff.address,
                status: staff.status,
            })
        }

    }, [staff])

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch(`/cms/staffs/${params.id}`, loginForm)
            .then(() => navigate('/cms/staffs'))
            .then(({ data }) => dispatch(addUser(data)))
            .catch(err => { })
            .finally(() => setLoading(false))
    }

    const handleSwitch = () => {
        setLoginForm({
            ...loginForm,
            status: !loginForm.status
        })
    }

    return <div className="edit-staff-login-form">
        <h2 className="edit-staff-label">Edit-Staff</h2>
        {loadingPage ?
            <Loading /> :
            <form className="edit-staff-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" defaultValue={loginForm.name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" defaultValue={staff.email} onChange={handleChange} disabled style={{ border: "none" }} />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <input type="text" id="phone" name="phone" defaultValue={loginForm.phone} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" defaultValue={loginForm.address} onChange={handleChange} />
                </div>
                <div className="staff-switch-container">
                    <label htmlFor="switch" className="switch-label">Status:</label>
                    <div className="switch-react">
                        <span className="staff-status-label-1">Inactive</span>
                        <Switch height={24} checked={loginForm.status} onChange={handleSwitch} offColor="#00001a" />
                        <span className="staff-status-label-2">Active</span>
                    </div>
                </div>

                <SubmitButton loading={loading} />
            </form>}
    </div>
}
