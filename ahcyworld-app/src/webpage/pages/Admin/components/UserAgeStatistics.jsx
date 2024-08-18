import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { userList } from "../../../../apis/auth";
import { CiUser } from "react-icons/ci";

// Chart.js 모듈 등록
ChartJS.register(ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const UserAgeStatistics = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await userList();
                // console.log("유저리스트: ", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("userList Error: ", error);
            }
        };
        fetchUsers();
    }, []);

    const ageRanges = ["10대", "20대", "30대", "40대", "50대", "60대"];
    const ageCounts = new Array(ageRanges.length).fill(0);

    users.forEach((user) => {
        if (user.birthDay) {
            const age = new Date().getFullYear() - new Date(user.birthDay).getFullYear();
            if (age >= 10 && age < 20) ageCounts[0]++;
            else if (age >= 20 && age < 30) ageCounts[1]++;
            else if (age >= 30 && age < 40) ageCounts[2]++;
            else if (age >= 40 && age < 50) ageCounts[3]++;
            else if (age >= 50 && age < 60) ageCounts[4]++;
            else if (age >= 60) ageCounts[5]++;
        }
    });

    const totalUsers = users.length;

    const data = {
        labels: ageRanges,
        datasets: [
            {
                label: "연령대 분포",
                data: ageCounts,
                backgroundColor: ["#FFB3B3", "#B3E5FC", "#DCE775", "#FFAB91", "#C5E1A5", "#CE93D8"],
                borderColor: "#fff",
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            datalabels: {
                color: "#727272",
                anchor: "center",
                align: "center",
                formatter: (value, context) => {
                    const label = context.chart.data.labels[context.dataIndex];
                    const percentage = ((value / totalUsers) * 100).toFixed(1);
                    return `${percentage} %`;
                },
                font: {
                    weight: "bold",
                    size: 18,
                    style: "italic",
                    // lineHeight: 4,
                },
                display: true,
                textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)", // x-offset, y-offset, blur, color
            },
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}명`;
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className='user-graph-box'>
            <h3>
                <CiUser />
                &nbsp;연령대별 사용자 분포
            </h3>
            <Doughnut data={data} options={options} />
            <br />
        </div>
    );
};

export default UserAgeStatistics;
