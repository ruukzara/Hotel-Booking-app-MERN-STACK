import { useEffect, useState } from "react"
import { isNull } from "../lib"
import "./DataTable.css"
import moment from "moment"
import React from 'react';


export const DataTable = ({ data = [], searchable = [], sortable = [] }) => {
    const [list, setList] = useState([])
    const [term, setTerm] = useState('')
    const [sortBy, setSortBy] = useState('')
    const [sortDir, setSortDir] = useState('desc')
    const [perPage, setPerPage] = useState(4)
    const [offset, setOffset] = useState(0)
    const [pageNo, setPageNo] = useState(1)
    const [total, setTotal] = useState(1)
    const [paginated, setPaginated] = useState([])
    const [pageLinks, setPageLinks] = useState([])

    useEffect(() => {
        setList(data)
    }, [data])

    useEffect(() => {
        if (term.length) {
            const filteredList = data.filter(item => {
                return searchable.some(key => {
                    const value = item[key];
                    return value && value.toString().toLowerCase().includes(term.toLowerCase());
                });
            });
            setList(filteredList);
        } else {
            setList(data);
        }
        setSortBy('')
        setSortDir('desc')
    }, [data, term]);


    const handleSort = title => {
        if (title == sortBy) {
            setSortDir(sortDir == 'desc' ? 'asc' : 'desc')
        } else {
            setSortBy(title)
            setSortDir('desc')
        }
    }

    useEffect(() => {
        if (sortBy.length) {
            let temp = [...list].sort((a, b) => {
                if (isNaN(parseFloat(a[sortBy])) || isNaN(parseFloat(b[sortBy]))) {
                    if (moment(a[sortBy]).isValid() && moment(b[sortBy]).isValid()) {
                        return moment(a[sortBy]) - moment(b[sortBy])
                    } else {
                        let x = String(a[sortBy]).toLowerCase()
                        let y = String(b[sortBy]).toLowerCase()
                        if (x < y) { return -1 }
                        if (x > y) { return 1 }
                        return 0
                    }
                } else {
                    return a[sortBy] - b[sortBy]
                }
            })

            if (sortDir == 'desc') {
                temp.reverse()
            }
            setList(temp)
        }
    }, [sortBy, sortDir])

    useEffect(() => {
        let temp = [...list].splice(offset, perPage)
        setPaginated(temp)
    }, [list, offset])

    useEffect(() => {
        setPageNo(1)
        let tmp = [...list].splice(offset, perPage)
        setPaginated(tmp)
        let temp = Math.ceil(list.length / perPage)
        setTotal(temp)
    }, [list, perPage])

    useEffect(() => {
        let temp = (pageNo - 1) * perPage
        setOffset(temp)
    }, [pageNo])

    useEffect(() => {
        let temp = []
        const maxPageLinks = 3 // Maximum number of page links to display

        // Calculate the starting and ending page numbers based on the current pageNo and maxPageLinks
        let startPage = Math.max(1, pageNo - Math.floor(maxPageLinks / 2))
        let endPage = Math.min(total, startPage + maxPageLinks - 1)

        // Adjust the starting page number if the ending page is at the total
        startPage = Math.max(1, endPage - maxPageLinks + 1)

        for (let i = startPage; i <= endPage; i++) {
            if (pageNo === i) {
                temp.push(
                    <button
                        key={i}
                        className="active"
                        onClick={() => setPageNo(i)}
                    >
                        {i}
                    </button>
                )
            } else {
                temp.push(
                    <button
                        key={i}
                        onClick={() => setPageNo(i)}
                    >
                        {i}
                    </button>
                )
            }
        }
        setPageLinks(temp)
    }, [total, pageNo])

    const handleNextPage = () => {
        if (pageNo < total) {
            setPageNo((prevPageNo) => prevPageNo + 1)
        }
    }

    return <><div className="search-flex"> <input
        type="text"
        placeholder="Search..."
        className="search-button"
        onChange={(ev) => setTerm(ev.target.value)}
    />
        {!isNull(paginated) ? <div >
            <select id="perPage" defaultValue={perPage} onChange={(ev) => setPerPage(ev.target.value)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select><br />
            <label className="perPage" htmlFor="perPage">per page </label>
        </div> : null}

    </div>
        <div>
            {isNull(paginated) ? <h5 style={{ paddingBottom: "20px" }}>No data found.</h5> :
                <div className="staffs-data-table">
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(paginated[0]).map((title, i) => {
                                    if (sortable.includes(title)) {
                                        return <th key={i} className="sortable" onClick={() => handleSort(title)}>{title}{sortBy == title ? <i className={`fa-solid fa-chevron-${sortDir == 'desc' ? 'down' : 'up'}`}></i> : null} </th>
                                    } else {
                                        return <th key={i}>{title}</th>
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.map((item, index) => <tr key={index}>
                                {Object.keys(item).map((title, index) => <td key={index}>{item[title]}</td>)}
                            </tr>)}
                        </tbody>
                    </table>
                    {total > 1 ?
                        <div className="pagination-container">
                            <button
                                disabled={pageNo === 1}
                                onClick={() => setPageNo(pageNo - 1)}
                                className={pageNo === 1 ? "disabled" : ""}
                            >
                                Prev
                            </button>
                            {pageLinks.map((link) => link)}
                            <button
                                disabled={pageNo === total}
                                onClick={handleNextPage}
                                className={pageNo === total ? "disabled" : ""}
                            >
                                Next
                            </button>
                        </div> : null}
                </div>
            }
        </div >
    </>
}
