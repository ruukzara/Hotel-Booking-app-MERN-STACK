import React, { useState } from 'react'
import "./Auth.css"
import { inStorage, setInState } from '../../lib'
import http from '../../http'
import { useDispatch } from 'react-redux'
import { addUser } from '../../store'
import { useNavigate } from 'react-router-dom'
import { SubmitButton } from '../../components'

export const Login = () => {
  const [loginForm, setLoginForm] = useState({})
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = ev =>
    setInState(ev, loginForm, setLoginForm) 

  const handleSubmit = ev => {
    ev.preventDefault()
    setLoading(true)

    http.post('auth/login', loginForm)
      .then(({ data }) => {
        dispatch(addUser(data.user))
        inStorage('user_token', data.token, rememberMe)
        navigate('/')
      })
      .catch(error => { })
      .finally(() => setLoading(false))
  }

  return <div className="login-form">
    <h2 className="login-label">Login</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="email"
          id="email"
          name='email'
          placeholder="Email"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          id="password"
          name='password'
          placeholder="Password"
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group remember-me">

        <input
          type="checkbox"
          id="remember"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        <label htmlFor="remember" className="remember-label">
          &nbsp; &nbsp; Remember me
        </label>
      </div>
      <div className="form-group">
        <SubmitButton loading={loading} label="Log In" icon='fa-right-from-bracket' />
      </div>
    </form>
  </div>
}



