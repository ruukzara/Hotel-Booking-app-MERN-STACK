import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat } from "../../lib"

export const List = () => {
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(false)

    const loadData = () => {
        setLoading(true)
        http.get('/cms/brands')
            .then(({ data }) => setBrands(data))
            .catch(error => { })
            .finally(setLoading(false))
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleDelete = id => confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do delete this?',
        buttons: [
            {
                label: 'Yes',
                onClick: () => {
                    setLoading(true)

                    http.delete(`/cms/brands/${id}`)
                        .then(() => loadData())
                        .catch(error => { })
                        .finally(() => setLoading(false))
                }
            },
            {
                label: 'No',
                onClick: () => { }
            }
        ]
    })

    return <>
        <div className="brands-header">
            <div className="brands-list">
                <div className="brands-list-header">
                    <h1> Brands </h1>
                </div>

                <div className="add-brand-button">
                    <Link to="/cms/brands/create">
                        <button>
                            <i className="fa-solid fa-plus"></i>
                            Add Brand
                        </button>
                    </Link>
                </div>
            </div>

            <div className="brands-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'Slug', 'Created At',
                        'Updated At']} searchable={['Name', 'Slug', 'Status', 'Created At',
                            'Updated At'
                        ]} data={brands.map(brand => {
                            return {
                                'Name': brand.name,
                                'Slug': brand.slug,
                                'Status': brand.status ? 'Active' : 'Inactive',
                                'Created At': dtFormat(brand.createdAt),
                                'Updated At': dtFormat(brand.updatedAt),
                                'Actions': <>
                                        <Link to={`/cms/brands/${brand._id}`} className="edit-all edit-brands">
                                            <i className="fa-solid fa-edit" title="Edit"></i>
                                        </Link>
                                        <button type="button" onClick={() => handleDelete(brand._id)} className="delete-button">
                                            <i className="fa-solid fa-trash" title="Delete" style={{ backgroundColor: "#C70039" }}></i>
                                        </button>
                                </>
                            }
                        })} />
                }
            </div>
        </div>
    </>
}
