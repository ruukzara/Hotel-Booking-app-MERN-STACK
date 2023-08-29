import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat } from "../../lib"

export const List = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)

    const loadData = () => {
        setLoading(true)
        http.get('/cms/categories')
            .then(({ data }) => setCategories(data))
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

                    http.delete(`/cms/categories/${id}`)
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
        <div className="categories-header">
            <div className="categories-list">
                <div className="categories-list-header">
                    <h1> Categories </h1>
                </div>

                <div className="add-category-button">
                    <Link to="/cms/categories/create">
                        <button>
                            <i className="fa-solid fa-plus"></i>
                            Add Category
                        </button>
                    </Link>
                </div>
            </div>

            <div className="categories-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'Slug', 'Created At',
                        'Updated At']} searchable={['Name', 'Slug', 'Status', 'Created At',
                            'Updated At'
                        ]} data={categories.map(category => {
                            return {
                                'Name': category.name,
                                'Slug': category.slug,
                                'Status': category.status ? 'Active' : 'Inactive',
                                'Created At': dtFormat(category.createdAt),
                                'Updated At': dtFormat(category.updatedAt),
                                'Actions': <>
                                        <Link to={`/cms/categories/${category._id}`} className="edit-all edit-categories">
                                            <i className="fa-solid fa-edit" title="Edit"></i>
                                        </Link>
                                        <button type="button" onClick={() => handleDelete(category._id)} className="delete-button">
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
