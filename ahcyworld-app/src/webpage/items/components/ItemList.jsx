import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER_HOST } from "../../../apis/api";
import "../css/ItemList.css";
import { Button } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import ItemPagination from "./ItemPagination";

const ItemList = (props) => {
    const [items, setItems] = useState([]);
    const [isMusic, setIsMusic] = useState(false);
    const [isFont, setIsFont] = useState(false);
    const [totalPage, setTotalPage] = useState(10);

    useEffect(() => {
        const type = props.itemKind;
        axios({
            method: "GET",
            url: `${SERVER_HOST}/item/${type}`,
        }).then((response) => {
            const { data, status } = response;
            if (status === 200) {
                const threeItems = [];
                for (let i = 0; i < [...data].length; i += 3) {
                    threeItems.push([...data].slice(i, i + 3));
                }
                setItems(threeItems);
                if (data[0].itemType === "배경음악") {
                    setIsMusic(true);
                } else {
                    setIsMusic(false);
                }
                if (data[0].itemType === "글꼴") {
                    setIsFont(true);
                } else {
                    setIsFont(false);
                }
            }
        });
    }, [props.itemKind]);

    return (
        <>
            <table>
                <tbody className='itemListFram'>
                    {items.map((threeItem, rowIndex) => (
                        <tr className='itemRow' key={rowIndex}>
                            {threeItem.map((item, colIndex) => (
                                <td className='item'>
                                    {isFont ? (
                                        <input
                                            className='fontStyle'
                                            type='text'
                                            style={{ fontFamily: `${item.sourceName}, cursive`, fontSize: 50 }}
                                            value='AhCyWorld'
                                        />
                                    ) : isMusic ? (
                                        <img src={item.bgmImg} />
                                    ) : (
                                        <img
                                            src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                                            style={{ height: "250px" }}
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
                                    <button className='pushItem'>장바구니추가</button>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <ItemPagination totalPages={totalPage} />
        </>
    );
};
export default ItemList;
