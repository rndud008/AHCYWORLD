import React, { useEffect, useState } from "react";
import "../css/UserManageStatistics.css";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    PointElement,
} from "chart.js";
import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { userList } from "../../../../apis/auth";

// Chart.js 모듈 등록
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const UserStatistics = () => {
    const [payments, setUsers] = useState([]);
    const [userCount, setUserCount] = useState({});

    const fetchUsers = async () => {
        try {
            const response = await userList();
            // console.log("유저리스트: ", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("userList Error: ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (payments.length > 0) {
            const sum = {};
            payments.forEach((user) => {
                const date = new Date(user.createAt);
                const month = date.getMonth();
                const year = date.getFullYear();
                const key = `${year}-${month + 1}`;

                sum[key] = (sum[key] || 0) + 1;
            });
            setUserCount(sum);
        }
    }, [payments]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Monthly User Registrations",
                data: labels.map((_, i) => userCount[`2024-${i + 1}`] || 0), // 월별 데이터 추출
                backgroundColor: "#fff",
                borderColor: "#5a5a5a",
                borderWidth: 1,
                pointBackgroundColor: "#e66e28",
                pointBorderColor: "#e66e28",
                pointBorderWidth: 5,
                datalabels: {
                    color: "#444",
                    display: true,
                    align: "top",
                    anchor:"end",
                    
                },
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.dataset.label + ": " + tooltipItem.raw;
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <>
            <div className='chart-container'>
                <h2>신규가입</h2>
                <div className='line-chart'>
                    <Line data={data} options={options} />
                </div>
            </div>
        </>
    );
};

export default UserStatistics;
