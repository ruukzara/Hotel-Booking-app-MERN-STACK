import { Outlet } from "react-router-dom"
import { NavMenu } from "./NavMenu"
import "@fortawesome/fontawesome-free/css/all.min.css"
import "react-toastify/dist/ReactToastify.min.css"
import React from 'react';


export const Layout = () => {
  return <>
    <NavMenu />

    <Outlet />
  </>
}
