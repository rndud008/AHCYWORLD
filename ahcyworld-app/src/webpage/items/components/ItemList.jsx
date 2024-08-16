import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import "../css/ItemList.css";
import ItemPagination from "./ItemPagination";
import * as Swal from "../../../apis/alert";
import { Navigate, useNavigate } from "react-router-dom";
import { LoginContext } from "../../components/login/context/LoginContextProvider";
import acorn from "../../../upload/acorn.png"

const ItemList = (props) => {
    const [items, setItems] = useState([]);
    const [userItems, setUserItems] = useState([]);
    const [pageData, setPageData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const { userInfo } = useContext(LoginContext)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                window.scroll(0, 0);
                const type = props.itemkind;
                let firstpage = 0;
                if (localStorage.getItem("currentType") === type) {
                    firstpage = currentPage;
                } else {
                    firstpage = 1;
                    setCurrentPage(1);
                }
                const itemResponse = await axios({
                    method: "GET",
                    url: `${SERVER_HOST}/item/${type}`,
                    params: { page: firstpage },
                });

                const cartResponse = await axios({
                    method: "GET",
                    url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
                });
                const cartsItems = [];
                (cartResponse.data).forEach(item => { cartsItems.push(item.item.id) });
                setUserItems(cartsItems);

                const { status } = itemResponse;
                const items = itemResponse.data.items;
                localStorage.setItem("currentType", type);
                if (status === 200) {
                    const threeItems = [];
                    for (let i = 0; i < [...items].length; i += 3) {
                        threeItems.push([...items].slice(i, i + 3));
                    }
                    setItems(threeItems);
                    setPageData({ ...itemResponse.data });
                }
            } catch (error) {
                console.error("error data");
            }

        }

        fetchData();

    }, [props.itemkind, currentPage]);

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
            <table className="itemTable-user">
                <tbody className='itemListFram'>
                    {items.map((threeItem, rowIndex) => (
                        <tr className='itemRow' key={rowIndex}>
                            {threeItem.map((item, colIndex) => (
                                <td className='item' key={colIndex}>
                                    {item.itemType === '글꼴' ? (
                                        <input
                                            className='fontStyle'
                                            type='text'
                                            style={{ fontFamily: `${item.sourceName}, cursive`, fontSize: 50 }}
                                            value='AhCyWorld'
                                            readOnly
                                        />
                                    ) : item.itemType === '배경음악' ? (
                                        <img className="itemImg" src={item.bgmImg} alt="" />
                                    ) : (
                                        <img
                                            className="itemImg"
                                            src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                                            alt=""
                                        />
                                    )}
                                    <br />
                                    {item.itemType === '배경음악' ? (
                                        <div className="item-music-title">
                                            {item.sourceName}-{item.itemName} <br /> {item.price}도토리
                                            <br />
                                        </div>
                                    ) : (
                                        <div style={{ fontSize: 30 }}>
                                            {item.itemName} <br /> {item.price} <img className="acorn-img" src={acorn}></img>
                                            <br />
                                        </div>
                                    )}
                                    {userItems.includes(item.id) ? <div>보유중</div> : <button className='pushItem' onClick={() => addCart(item)}>장바구니추가</button>}
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
