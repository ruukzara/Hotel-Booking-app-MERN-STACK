import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clearStorage, fromStorage, isNull } from "../lib"
import { useNavigate } from "react-router-dom"
import http from "../http"
import { addUser } from "../store"
import { Loading } from "../components"
import React from 'react';


export const PrivateRoute = () => {
    const [loading, setLoading] = useState(false)

    const user = useSelector(st => st.user.value)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (isNull(user)) {
            const token = fromStorage('cms_token')

            if (!isNull(token)) {
                setLoading(true)
                http.get('/profile/details')
                    .then(({ data }) => dispatch(addUser(data)))
                    .catch(error => {
                        if (error && error.response && error.response.status === 401) {
                            clearStorage('cms_token')
                            navigate('/login')
                        }
                    })
                    .finally(setLoading(false))
            } else {
                navigate('/login')
            }
        }

    }, [user])
    
    return loading ? <Loading /> :<Outlet />
}