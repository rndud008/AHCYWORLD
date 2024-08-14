import axios from "axios";
import React, { useEffect, useState } from "react";
import acorn from "../../../upload/acorn.png";
import { SERVER_HOST } from "../../../apis/api";
import "./BestItem.css";

const BestItem = () => {
    const [topItems, setTopItems] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        axios
            .get(`${SERVER_HOST}/cart/top-selling-items`)
            .then((response) => {
                const { data, status } = response;
                if (status === 200) {
                    setTopItems(data);
                    // 첫번째 카테고리 선택
                    setSelectedCategory(Object.keys(data)[0]);
                    console.log("top3 아이템 불러오기 성공", data);
                }
            })
            .catch((error) => {
                console.error("top3 아이템 불러오기 실패", error);
            });
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    }

    return (
        <>
        <div className="bestItems-container">
            <div className="category-menu">
                {Object.keys(topItems).map((itemType) => (
                    <button 
                        key={itemType}
                        className={`category-button ${selectedCategory === itemType ? "active" : ""}`}
                        onClick={() => handleCategoryClick(itemType)}
                        >
                        {itemType}
                    </button>
                ))}
            </div>

            <div className="item-display">
                <h2 className="best-item-title">{selectedCategory}</h2>
                {topItems[selectedCategory] && (
                    <div className="item-type-section">
                        <ul>
                            {topItems[selectedCategory].map((item) => (
                                <li key={item.id} className="item-card">
                                    <div className="item-name">{item.itemName}</div>
                                    <div className="item-price">
                                        가격 : {item.price}
                                        <img className="bestItem-acorn" src={acorn} alt="" />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default BestItem;
