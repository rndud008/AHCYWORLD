import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
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
import { userList } from "../../../../apis/auth";

// Chart.js 모듈 등록
ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement);

const UserCountStatistics = () => {
    const [users, setUsers] = useState([]);
    const [userCount, setUserCount] = useState({});
    const [totalCount, setTotalCount] = useState({});

    const fetchUsers = async () => {
        try {
            const response = await userList();

            setUsers(response.data);
        } catch (error) {
            console.error("userList Error: ", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            const monthlyCount = {};
            const cumulativeCount = {};
            let cumulativeTotal = 0;

            // 모든 사용자에 대해 월별 사용자 수 계산
            users.forEach((user) => {
                const date = new Date(user.createAt);
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const key = `${year}-${month.toString().padStart(2, "0")}`;

                monthlyCount[key] = (monthlyCount[key] || 0) + 1;
            });

            // 누적 사용자 계산
            const sortedKeys = Object.keys(monthlyCount).sort();
            sortedKeys.forEach((key) => {
                cumulativeTotal += monthlyCount[key];
                cumulativeCount[key] = cumulativeTotal;
            });

            setUserCount(monthlyCount);
            setTotalCount(cumulativeCount);
        }
    }, [users]);

    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const currentYear = new Date().getFullYear();

    const data = {
        labels: labels,
        datasets: [
            {
                type: "bar",
                label: `${currentYear} 신규가입자`,
                data: labels.map((_, i) => userCount[`${currentYear}-${(i + 1).toString().padStart(2, "0")}`] || 0), // 월별 데이터 추출
                backgroundColor: "#aebadf",
                borderColor: "#aebadf",
                borderWidth: 1,
                datalabels: {
                    display: true,
                    align: "center",
                    anchor: "center",
                    formatter: (value) => (value === 0 ? null : value),
                    color: "#fff",
                    backgroundColor: "#aebadf",
                    borderRadius: 3,
                    padding: 4,
                },
            },
            {
                type: "line",
                label: "누적가입자",
                data: labels.map((_, i) => {
                    const key = `${currentYear}-${(i + 1).toString().padStart(2, "0")}`;
                    return totalCount[key] || 0;
                }),
                backgroundColor: "#e66e28",

                borderWidth: 2,
                pointBackgroundColor: "#e66e28",
                pointBorderColor: "#e66e28",
                pointBorderWidth: 2,
                pointRadius: 5,
                datalabels: {
                    color: "#444",
                    display: true,
                    align: "end",
                    anchor: "end",
                },
            },
        ],
    };

    const maxValue = Math.max(
        ...labels.map((_, i) => userCount[`${currentYear}-${(i + 1).toString().padStart(2, "0")}`] || 0),
        ...labels.map((_, i) => totalCount[`${currentYear}-${(i + 1).toString().padStart(2, "0")}`] || 0)
    );

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
            datalabels: {
                display: true,
                anchor: "end",
                align: "top",
                formatter: (value) => (value === 0 ? null : value),
                color: "#444",
                font: {
                    weight: "bold",
                },
                offset: 10,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
                suggestedMax: maxValue + 10,
            },
        },
    };

    return (
        <>
            <div className='chart-container'>
                <h2>누적회원</h2>
                <div className='line-chart'>
                    <Line data={data} options={options} />
                </div>
            </div>
        </>
    );
};

export default UserCountStatistics;
