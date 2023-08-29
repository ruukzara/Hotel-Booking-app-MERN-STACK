import React, { useEffect, useState } from 'react';
import http from "../../http"


export const Welcome = () => {
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const getData = async () => {
          try {
            const response = await http.get('/profile/details')
            const userData = response.data
            setUser(userData)
            setLoading(false)
          } catch (error) {
            console.log("Error fetching user data", error)
            setLoading(false)
          }
        }
    
        getData()
      }, [])
    
    return <div className="user-card">
        <div className="user-card-header">
            <h3 className="user-card-title">Welcome to your database</h3>
        </div>
        <div className="user-card-body">
            <div className="profile-card-content">
                <h2 className="profile-name">{user.name}</h2>
                <div className="profile-info">
                    <p className="profile-info-text">{user.email}</p>
                </div>
                <div className="profile-info">
                    <p className="profile-info-text">{user.address}</p>
                </div>
                <div className="profile-info">
                    <p className="profile-info-text">{user.phone}</p>
                </div>
            </div>
        </div>
    </div>
}

