import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from "../components"
import * as Pages from "../pages"
import React from 'react';


export const AllRoutes = () => <BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Pages.Front.Home />} />

      <Route path="/edit-profile" element={<Pages.Front.Edit />} />

      <Route path="/change-password" element={<Pages.Front.Password />} />

      <Route path="/search" element={<Pages.Front.Dashboard />} />

      <Route path="/search/:id" element={<Pages.Front.HotelPage />} />

      <Route path="/search/city/:city" element={<Pages.Front.SearchCity />} />

      <Route path="/register" element={<Pages.Front.Register />} />

      <Route path="/login" element={<Pages.Front.Login />} />

      <Route path="/favourites" element={<Pages.Front.Favourites />} />

      <Route path="/contact" element={<Pages.Front.ContactPage />} />


    </Route>

    <Route path="*" element={<Pages.Errors.Error404 />} />
  </Routes>
</BrowserRouter>








