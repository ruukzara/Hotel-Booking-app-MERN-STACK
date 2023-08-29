import { Sidebar } from "./sidebar"
import { LineChartComp } from "./LineChart"
import { TotalNumber } from "./totalNumber"
import { Welcome } from "./welcome"
import React from 'react';


export const List = () => {
  return <div className='mainNav'>
    <div>
      <Sidebar />
    </div>

    <div className='flex-chart'>
      <TotalNumber />
      <div className="flex-chart-1">
        <Welcome />
        <LineChartComp />
      </div>
    </div>
  </div>
}

