import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import "./BestItem.css";

const BestItem = () => {
    const [topItems, setTopItems] = useState({});

    useEffect(() => {
        axios
            .get(`${SERVER_HOST}/cart/top-selling-items`)
            .then((response) => {
                const { data, status } = response;
                if (status === 200) {
                    setTopItems(data);
                    console.log("top3 아이템 불러오기 성공", data);
                }
            })
            .catch((error) => {
                console.error("top3 아이템 불러오기 실패", error);
            });
    }, []);

    return (
        <>
            <div className="bestItems-container">
                <h2 className="best-item-title">Best Items</h2>
                {Object.keys(topItems).map((itemType) => (
                    <div key={itemType} className="item-type-section">
                        <h2>{itemType}</h2>
                        <ul>
                            {topItems[itemType].map((item) => (
                                <li key={item.id} className="item-card">
                                    <div className="item-name">
                                        {item.itemName}
                                    </div>
                                    <div className="item-price">
                                        가격: {item.price} 도토리
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

export default BestItem;
