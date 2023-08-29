import React, { useState } from 'react'
import "./Auth.css"
import { inStorage, setInState } from '../../lib'
import http from '../../http'
import { useDispatch } from 'react-redux'
import { addUser } from '../../store'
import { useNavigate } from 'react-router-dom'
import { SubmitButton } from '../../components'

export const Register = () => {
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

    http.post('/auth/register', loginForm)
      .then(() => {navigate('/login')})
      .catch(error => { })
      .finally(() => setLoading(false))
  }

  return <div className="login-form-register">
    <h2 className="login-label">Register</h2>
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="name"
          id="name"
          name='name'
          placeholder="Name"
          onChange={handleChange}
          required
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          id="confirm_password"
          name='confirm_password'
          placeholder="Confirm Password"
          value={loginForm.confirm_password}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          id="address"
          name='address'
          placeholder="Address"
          value={loginForm.address}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          id="phone"
          name='phone'
          placeholder="Phone"
          value={loginForm.phone}
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



