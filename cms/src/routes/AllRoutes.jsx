import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from "../components"
import * as Pages from "../pages"
import { PrivateRoute } from './'
import React from 'react';


export const AllRoutes = () => <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/cms" />} />

            <Route path="/cms" element={<PrivateRoute />} >

                <Route index element={<Pages.Dashboard.List />} />

                <Route path="edit-profile" element={<Pages.Profile.Edit />} />

                <Route path="change-password" element={<Pages.Profile.Password />} />

                <Route path="staffs" element={<Pages.Staffs.List />} />

                <Route path="staffs/create" element={<Pages.Staffs.Create />} />

                <Route path="staffs/:id" element={<Pages.Staffs.Edit />} />

                <Route path="categories" element={<Pages.Categories.List />} />

                <Route path="categories/create" element={<Pages.Categories.Create />} />

                <Route path="categories/:id" element={<Pages.Categories.Edit />} />

                <Route path="brands" element={<Pages.Brands.List />} />

                <Route path="brands/create" element={<Pages.Brands.Create />} />

                <Route path="brands/:id" element={<Pages.Brands.Edit />} />

                <Route path="customers" element={<Pages.Customers.List />} />

                <Route path="customers/:id" element={<Pages.Customers.Edit />} />
                
                <Route path="hotels" element={<Pages.Hotels.List />} />

                <Route path="hotels/create" element={<Pages.Hotels.Create />} />

                <Route path="hotels/:id" element={<Pages.Hotels.Edit />} />

                <Route path="reviews" element={<Pages.Reviews.List />} />

                <Route path="bookings" element={<Pages.Bookings.List />} />

                <Route path="rooms" element={<Pages.Rooms.List />} />

                <Route path="rooms/create" element={<Pages.Rooms.Create />} />
                
                <Route path="rooms/:id" element={<Pages.Rooms.Edit />} />

                <Route path="orderdetails/create" element={<Pages.OrderDetails.Create />} />

                <Route path="orderdetails/:id" element={<Pages.OrderDetails.Edit />} />

                <Route path="orderdetails" element={<Pages.OrderDetails.List />} />

            </Route>

            <Route path="/login" element={<Pages.Auth.Login />} />
            
            <Route path="*" element={<Pages.Errors.Error404 />} />

        </Route>
    </Routes>
</BrowserRouter>
