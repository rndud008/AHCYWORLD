import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import "../css/ItemList.css";
import ItemPagination from "./ItemPagination";
import { LoginContext } from "../../login/context/LoginContextProvider"
import * as Swal from "../../../apis/alert";
import { Navigate, useNavigate } from "react-router-dom";

const ItemList = (props) => {
    const [items, setItems] = useState([]);
    const [isMusic, setIsMusic] = useState(false);
    const [isFont, setIsFont] = useState(false);
    const [pageData, setPageData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const { userInfo } = useContext(LoginContext)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                window.scroll(0, 0);
                const type = props.itemKind;
                let firstpage = 0;
                if (localStorage.getItem("currentType") === type) {
                    firstpage = currentPage;
                } else {
                    firstpage = 1;
                    setCurrentPage(1);
                }
                const response = await axios({
                    method: "GET",
                    url: `${SERVER_HOST}/item/${type}`,
                    params: { page: firstpage },
                });

                const { data, status } = response;
                const { items } = data;
                localStorage.setItem("currentType", type);
                if (status === 200) {
                    const threeItems = [];
                    for (let i = 0; i < [...items].length; i += 3) {
                        threeItems.push([...items].slice(i, i + 3));
                    }
                    setItems(threeItems);
                    if (items[0].itemType === "배경음악") {
                        setIsMusic(true);
                    } else {
                        setIsMusic(false);

                    }
                    if (items[0].itemType === "글꼴") {
                        setIsFont(true);
                    } else {
                        setIsFont(false);
                    }
                    setPageData({ ...data });
                }
            } catch (error) {
                console.error("error data", error);
            }

        }

        fetchData();

    }, [props.itemKind, currentPage]);

    const addCart = (item) => {
        axios({
            method: "POST",
            url: `${SERVER_HOST}/cart/additem`,
            params: {
                username: userInfo.username,
                itemname: item.itemName,
            }
        }).then(response => {
            const { data, status, error } = response
            if (status === 201) {
                Swal.itemconfirm("장바구니에 추가", "장바구니화면으로 이동하시겠습니까?", "success", () => { navigate(`/cart/${userInfo.id}`) }, () => { return; });
            } else {
                window.alert("실패! : " + error)
            }

        })
    }

    return (
        <>
            <table className="itemTable">
                <tbody className='itemListFram'>
                    {items.map((threeItem, rowIndex) => (
                        <tr className='itemRow' key={rowIndex}>
                            {threeItem.map((item, colIndex) => (
                                <td className='item' key={colIndex}>
                                    {isFont ? (
                                        <input
                                            className='fontStyle'
                                            type='text'
                                            style={{ fontFamily: `${item.sourceName}, cursive`, fontSize: 50 }}
                                            value='AhCyWorld'
                                        />
                                    ) : isMusic ? (
                                        <img className="itemImg" src={item.bgmImg} />
                                    ) : (
                                        <img
                                            className="itemImg"
                                            src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                                        />
                                    )}
                                    <br />
                                    {isMusic ? (
                                        <div style={{ fontSize: 20 }}>
                                            {item.sourceName}-{item.itemName} <br /> {item.price}도토리
                                            <br />
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 20 }}>
                                            {item.itemName} <br /> {item.price}도토리
                                            <br />
                                        </div>
                                    )}
                                    <button className='pushItem' onClick={() => addCart(item)}>장바구니추가</button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="itemPagination">
                <ItemPagination pageData={pageData} setCurrentPage={setCurrentPage} />
            </div>
        </>
    );
};
export default ItemList;
