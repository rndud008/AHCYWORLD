import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { userList } from "../../../../apis/auth";
import "../css/AdminMain.css";
import { CiUser } from "react-icons/ci";
import UserAgeStatistics from "./UserAgeStatistics";
import ItemCategoryStatistics from "./ItemCategoryStatistics";
import UserCountStatistics from "./UserCountStatistics";
import PaymentStatistics from "./PaymentStatistics";

// Chart.js 모듈 등록
ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const AdminMain = () => {
    return (
        <>
            <div className='first-container'>
                <UserAgeStatistics />
                <UserCountStatistics />
            </div>
            <div className='second-container'>
                <PaymentStatistics />
                <ItemCategoryStatistics />
            </div>
        </>
    );
};

export default AdminMain;
