import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import acorn from "../../../upload/acorn.png";
import { SERVER_HOST } from "../../../apis/api";
import "./BestItem.css";
import * as Swal from "../../../apis/alert";
import { LoginContext } from "../login/context/LoginContextProvider";
import { useNavigate } from "react-router-dom";

const BestItem = () => {
    const [topItems, setTopItems] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [userItems, setUserItems] = useState([]);
    const { userInfo } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopItems = async () => {
            try {
                const response = await axios.get(
                    `${SERVER_HOST}/cart/top-selling-items`
                );
                if (response.status === 200) {
                    setTopItems(response.data);
                    setSelectedCategory(Object.keys(response.data)[0]);
                    // console.log("top5 아이템 불러오기 성공", response.data);
                }
            } catch (error) {
                console.error("top5 아이템 불러오기 실패", error);
            }
        };
        fetchTopItems();
    }, []);

    useEffect(() => {
        const fetchUserItems = async () => {
            if (userInfo && userInfo.id) {
                try {
                    const response = await axios.get(
                        `${SERVER_HOST}/cart/${userInfo.id}/items`
                    );
                    const items = response.data.map((item) => item.item.id);
                    setUserItems(items);
                } catch (error) {
                    console.error("장바구니 아이템 불러오기 실패", error);
                }
            } else {
                setUserItems([]);
            }
        };

        fetchUserItems();
    }, [userInfo]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const addCart = async (item) => {
        // 로그인 상태 확인
        if (!userInfo || !userInfo.id) {
            Swal.alert(
                "로그인이 필요합니다.",
                "아이템을 추가하려면 로그인이 필요합니다.",
                "warning",
                () => {
                    return;
                }
            );
            return;
        }

        // 이미 장바구니 또는 보유 여부 확인
        if (userItems.includes(item.id)) {
            Swal.alert(
                "이미 보유중입니다.",
                "해당 아이템을 이미 갖고 있거나 장바구니에 있습니다.",
                "info",
                () => {
                    return;
                }
            );
            return;
        }

        try {
            const response = await axios.post(
                `${SERVER_HOST}/cart/additem`,
                null,
                {
                    params: {
                        username: userInfo.username,
                        itemname: item.itemName,
                    },
                }
            );

            if (response.status === 201) {
                Swal.itemconfirm(
                    "장바구니에 추가",
                    "장바구니화면으로 이동하시겠습니까?",
                    "success",
                    () => {
                        navigate(`/cart/${userInfo.id}`);
                    },
                    () => {
                        return;
                    }
                );
                setUserItems((prev) => [...prev, item.id]);
            } else {
                window.alert(
                    "베스트아이템에서 장바구니에 넣기 실패! : " + response.error
                );
                console.error(
                    "베스트아이템에서 장바구니에 넣기 실패! : " +
                        response.statusText
                );
            }
        } catch (error) {
            console.error("아이템 추가 중 에러 발생 :", error);
            Swal.alert(
                "오류",
                "아이템을 추가하는 동안 오류가 발생했습니다.",
                "error"
            );
        }
    };

    if (topItems === null) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="bestItems-container">
                <div className="category-menu">
                    <h2 className="best-item-title">{selectedCategory}</h2>
                    {Object.keys(topItems).map((itemType) => (
                        <button
                            key={itemType}
                            className={`category-button ${
                                selectedCategory === itemType ? "active" : ""
                            }`}
                            onClick={() => handleCategoryClick(itemType)}
                        >
                            {itemType}
                        </button>
                    ))}
                </div>

                <div className="item-display">
                    {topItems[selectedCategory] && (
                        <div className="item-type-section">
                            <ul>
                                {topItems[selectedCategory].map((item) => (
                                    <li
                                        key={item.id}
                                        className="item-card"
                                        onClick={() => addCart(item)}
                                    >
                                        <div className="item-name">
                                            {item.itemName}
                                        </div>
                                        <div className="item-price">
                                            가격 : {item.price}
                                            <img
                                                className="bestItem-acorn"
                                                src={acorn}
                                                alt=""
                                            />
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
