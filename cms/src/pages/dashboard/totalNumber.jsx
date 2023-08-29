import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';
import http from '../../http';

export const TotalNumber = ({ data }) => {

    const [loading, setLoading] = useState(false);
    const [numberOfStaffs, setNumberOfStaffs] = useState(0);
    const [staffs, setStaffs] = useState([]);
    const [users, setUsers] = useState(0);
    const [activeStaffs, setActiveStaffs] = useState(0);
    const [inactiveStaffs, setInactiveStaffs] = useState(0);
    
    useEffect(() => {
        setLoading(true);
        http.get('/cms/staffs')
          .then(({ data }) => {
            setStaffs(data);
            const count = data.filter(staff => staff.role === 'staff');
            const activeStaffsData = data.filter(staff => staff.status === true);
            const inactiveStaffsData = data.filter(staff => staff.status === false);
            setActiveStaffs(activeStaffsData.length);
            setInactiveStaffs(inactiveStaffsData.length);
            setNumberOfStaffs(count.length);
          })
          .catch(error => { })
          .finally(() => setLoading(false));
      }, []);


    const totalUserCount = 100;
    const totalHotelCount = 67;
    const totalStaffCount = numberOfStaffs;
    const trend = 'increase';

    const pcDataHotel = [
        { name: 'Used', value: 30, fill: '#8884d8' },
        { name: 'Unused', value: 86, fill: '#82ca9d' },
    ];

    const modifiedPCData = pcDataHotel.map((data) => ({
        name: data.name,
        value: data.value,
        fill: data.fill,
    }));

    const pieChartData = [
        { name: "Repeat Customers", value: 10, fill: "#8884d8" },
        { name: "New Customers", value: 20, fill: "#82ca9d" },
    ];
    const modifiedPieChartData = pieChartData.map((data) => ({
        name: data.name,
        value: data.value,
        fill: data.fill,
    }));

    const pcStaffData = [
        { name: "Active Staff", value: activeStaffs, fill: "#8884d8" },
        { name: "Inactive Staff", value: inactiveStaffs, fill: "#82ca9d" },
    ];
    const modifiedpcStaffData = pcStaffData.map((data) => ({
        name: data.name,
        value: data.value,
        fill: data.fill,
    }));
    return <>
        <div className='main-card'>
            <div className="card card-1">
                <div className="card-body" >
                    <div className="card-icon">
                        <i className="fa-solid fa-hotel"></i>
                    </div>
                    <h3 className="card-title">Total Hotels</h3>
                    <div className='HotelCard' style={{ display: "flex", justifyContent: "space-around" }}>
                        <div>
                            <p className="card-text">{totalHotelCount}</p> <i className="fas fa-arrow-right"></i> 
                        </div>
                        <div className="pc-container">
                            <PieChart width={120} height={120}>
                                <Pie
                                    data={modifiedPCData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    label={({ innerRadius, outerRadius }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    }}
                                />
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card card-2">
                <div className="card-body">
                    <div className="card-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <h3 className="card-title">Total Users</h3>
                    <div className='sub-card' style={{ display: "inline-flex" }}>
                        <div>
                            <p className="card-text">{totalUserCount}</p> <i className="fas fa-arrow-right"></i> 
                        </div>

                        <div className="pie-chart-container">
                            <PieChart width={120} height={120}>
                                <Pie
                                    data={modifiedPieChartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    outerRadius={50}
                                    label={({ innerRadius, outerRadius }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    }} />
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card card-3">
                <div className="card-body">
                    <div className="card-icon">
                        <i className="fa-solid fa-clipboard-user"></i>
                    </div>
                    <h3 className="card-title">Total Staffs</h3>
                    <div className='sub-card' style={{ display: "inline-flex" }}>
                        <div>
                        <p className="card-text">{totalStaffCount}</p><i className="fas fa-arrow-right"></i>
                        </div>

                        <div className="pie-chart-container">
                            <PieChart width={120} height={120}>
                                <Pie
                                    data={modifiedpcStaffData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    outerRadius={50}
                                    label={({ innerRadius, outerRadius }) => {
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    }} />
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
