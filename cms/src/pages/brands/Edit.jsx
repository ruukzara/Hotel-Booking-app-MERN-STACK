import React, { useEffect, useState } from "react"
import "./index.css"
import { useDispatch, useSelector } from "react-redux"
import { isNull, setInState } from "../../lib"
import { Loading, SubmitButton } from "../../components"
import http from "../../http"
import { addUser } from "../../store"
import { useNavigate, useParams } from "react-router-dom"
import Switch from "react-switch"
import slugify from "slugify"

export const Edit = () => {
    const [brand, setBrand] = useState({})
    const [loginForm, setLoginForm] = useState({ status: true })
    const [loading, setLoading] = useState(false)
    const [loadingPage, setLoadingPage] = useState(false)

    const user = useSelector(st => st.user.value)

    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        setLoadingPage(true)
        http.get(`/cms/brands/${params.id}`)
            .then(({ data }) => setBrand(data))
            .catch(error => { })
            .finally(setLoadingPage(false))
    }, [])

    useEffect(() => {
        if (!isNull(brand)) {
            setLoginForm({
                name: brand.name,
                slug: brand.slug,
                status: brand.status,
            })
        }

    }, [brand])

    useEffect(() => {
        if (loginForm && loginForm.name) {
            setLoginForm(prevForm => ({
                ...prevForm,
                slug: slugify(prevForm.name)
            }))
        }
    }, [loginForm.name])

    const handleChange = ev => setInState(ev, loginForm, setLoginForm)

    const handleSubmit = ev => {
        ev.preventDefault()
        setLoading(true)

        http.patch(`/cms/brands/${params.id}`, loginForm)
            .then(() => navigate('/cms/brands'))
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

    return <div className="edit-brand-login-form">
        <h2 className="edit-brand-label">Edit-brand</h2>
        {loadingPage ?
            <Loading /> :
            <form className="edit-brand-form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" defaultValue={loginForm.name} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="name">Slug:</label>
                    <input type="text" id="name" name="name" defaultValue={loginForm.slug} onChange={handleChange} />
                </div>

                <div className="brand-switch-container">
                    <label htmlFor="switch" className="switch-label">Status:</label>
                    <div className="switch-react">
                        <span className="brand-status-label-1">Inactive</span>
                        <Switch height={24} checked={loginForm.status} onChange={handleSwitch} offColor="#00001a" />
                        <span className="brand-status-label-2">Active</span>
                    </div>
                </div>

                <SubmitButton loading={loading} />
            </form>}
    </div>
}
