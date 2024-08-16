import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { soldItemList } from "../../../../apis/auth";
import { RiAlignItemBottomLine } from "react-icons/ri";

// Chart.js 모듈 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ItemCategoryStatistics = () => {
    const [soldItems, setSoldItems] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const response = await soldItemList();
                // console.log(response.data);
                const typeCounts = response.data.reduce((acc, cart) => {
                    const itemType = cart.item.itemType;
                    if (acc[itemType]) {
                        acc[itemType] += 1;
                    } else {
                        acc[itemType] = 1;
                    }
                    return acc;
                }, {});

                const labels = Object.keys(typeCounts);
                const counts = Object.values(typeCounts);

                setSoldItems({
                    labels: labels,
                    datasets: [
                        {
                            label: "Sold Items",
                            data: counts,
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error("soldItemList Error: ", error);
            }
        };

        fetchCarts();
    }, []);

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
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
        <div className='soldItem-chart-box'>
            <h3>
                <RiAlignItemBottomLine />
                &nbsp;카테고리별 아이템 판매량
            </h3>
            <Bar data={soldItems} options={chartOptions} />
        </div>
    );
};

export default ItemCategoryStatistics;
