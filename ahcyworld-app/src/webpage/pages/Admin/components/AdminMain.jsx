import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { userList } from "../../../../apis/auth";
import "../css/AdminMain.css";
import { CiUser } from "react-icons/ci";
import UserRange from "./UserRange";
import ItemCategoryStatistics from "./ItemCategoryStatistics";

// Chart.js 모듈 등록
ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const AdminMain = () => {
    return (
        <>
            <div className='first-container'>
                
                <UserRange />
                <ItemCategoryStatistics />
            </div>
        </>
    );
};

export default AdminMain;
