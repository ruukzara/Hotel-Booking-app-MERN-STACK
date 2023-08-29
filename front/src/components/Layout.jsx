import { Outlet, useParams } from "react-router-dom"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "react-toastify/dist/ReactToastify.min.css"
import React from 'react'
import { NavBarMenu } from "./NavbarMenu"
import { Search } from "../pages/front"

export const Layout = () => {
  const { id } = useParams()

  return (
    <>
      <NavBarMenu />
      
      <Outlet />
    </>
  )
}
