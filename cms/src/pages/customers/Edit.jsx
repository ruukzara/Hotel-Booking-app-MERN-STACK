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
    const [customer, setCustomer] = useState({})
    const [loginForm, setLoginForm] = useState({ status: true })
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)

    const user = useSelector(st => st.user.value)

    const dispatch = useDispatch()

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setLoadingPage(true)
        http.get(`/cms/customers/${params.id}`)
            .then(({ data }) => setCustomer(data))
            .catch(error => { })
            .finally(setLoadingPage(false))
    }, [])

    useEffect(() => {
        if (!isNull(customer)) {
            setLoginForm({
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address,
                status: customer.status,
            })
        }

    }, [customer])

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch(`/cms/customers/${params.id}`, loginForm)
            .then(() => navigate('/cms/customers'))
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

    return <div className="edit-customer-login-form">
        <h2 className="edit-customer-label">Edit-customer</h2>
        {loadingPage ?
            <Loading /> :
            <form className="edit-customer-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" defaultValue={loginForm.name} onChange={handleChange} disabled style={{ border: "none" }} />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" defaultValue={customer.email} onChange={handleChange} disabled style={{ border: "none" }} />
                </div>
                <div>
                    <label htmlFor="phone">Phone:</label>
                    <input type="text" id="phone" name="phone" defaultValue={loginForm.phone} onChange={handleChange} disabled style={{ border: "none" }} />
                </div>
                <div>
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" defaultValue={loginForm.address} onChange={handleChange} disabled style={{ border: "none" }} />
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
                </div>

                <SubmitButton loading={loading} />
            </form>}
    </div>
}
