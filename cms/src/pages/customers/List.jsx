import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat } from "../../lib"

export const List = () => {
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(false)
    const [countAll, setCountAll] = useState([])

    const loadData = () => {
        setLoading(true)
        http.get('/cms/customers')
            .then(({ data }) => {
                setCustomers(data)
                const count = data.filter(customer => customer.role === 'customer');
                setCountAll(count)
            })
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

                    http.delete(`/cms/customers/${id}`)
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
        <div className="customers-header">
            <div className="customers-list">
                <div className="customers-list-header">
                    <h1> Customers </h1>
                </div>

            </div>

            <div className="customers-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'Phone', 'Address', 'Created At',
                        'Updated At']} searchable={['Name', 'Email', 'Phone', 'Address', 'Status', 'Created At',
                            'Updated At'
                        ]} data={countAll.map(customer => {
                            return {
                                'Name': customer.name,
                                'Email': customer.email,
                                'Phone': customer.phone,
                                'Address': customer.address,
                                'Status': customer.status ? 'Active' : 'Inactive',
                                'Created At': dtFormat(customer.createdAt),
                                'Updated At': dtFormat(customer.updatedAt),
                                'Actions': <>
                                        <Link to={`/cms/customers/${customer._id}`} className="edit-all edit-customers">
                                            <i className="fa-solid fa-edit" title="Edit"></i>
                                        </Link>
                                        <button type="button" onClick={() => handleDelete(customer._id)} className="delete-button">
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
