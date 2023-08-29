import React, { useEffect, useState } from "react"
import "./index.css"
import http from "../../http"
import { Link } from "react-router-dom"
import { DataTable, Loading } from "../../components"
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import { dtFormat } from "../../lib"

export const List = () => {
    const [staffs, setStaffs] = useState([])
    const [loading, setLoading] = useState(false)

    const loadData = () => {
        setLoading(true)
        http.get('/cms/staffs')
            .then(({ data }) => setStaffs(data))
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

                    http.delete(`/cms/staffs/${id}`)
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
        <div className="staffs-header">
            <div className="staffs-list">
                <div className="staffs-list-header">
                    <h1> Staffs </h1>
                </div>

                <div className="add-staff-button">
                    <Link to="/cms/staffs/create">
                        <button>
                            <i className="fa-solid fa-plus"></i>
                            Add Staff
                        </button>
                    </Link>
                </div>
            </div>

            <div className="staffs-data">
                {loading ?
                    <Loading /> :
                    <DataTable sortable={['Name', 'Phone', 'Address', 'Created At',
                        'Updated At']} searchable={['Name', 'Email', 'Phone', 'Address', 'Status', 'Created At',
                            'Updated At'
                        ]} data={staffs.map(staff => {
                            return {
                                'Name': staff.name,
                                'Email': staff.email,
                                'Phone': staff.phone,
                                'Address': staff.address,
                                'Status': staff.status ? 'Active' : 'Inactive',
                                'Created At': dtFormat(staff.createdAt),
                                'Updated At': dtFormat(staff.updatedAt),
                                'Actions': <>
                                        <Link to={`/cms/staffs/${staff._id}`} className="edit-all edit-staffs">
                                            <i className="fa-solid fa-edit" title="Edit"></i>
                                        </Link>
                                        <button type="button" onClick={() => handleDelete(staff._id)} className="delete-button">
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
