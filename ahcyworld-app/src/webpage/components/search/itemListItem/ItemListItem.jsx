import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import acorn from "../../../../upload/acorn.png";
import axios from "axios";
import * as Swal from "../../../../apis/alert";
import api, { SERVER_HOST } from "../../../../apis/api";
import { LoginContext } from "../../login/context/LoginContextProvider";
import { useNavigate } from "react-router-dom";
import "./ItemListItem.style.css";

const ItemListItem = () => {
  const searchList = useSelector((state) => state.search.searchList);
  const { userInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const [userItemList, setUserItemList] = useState();
  const [userCartList, setUserCartList] = useState();

  const skinAndSotryRoom = ["스킨", "스토리룸"];

  const addCart = async (item) => {
    if (!userInfo) {
      Swal.alert("로그인이 필요합니다", "로그인을 해주세요.", "warning");
      return navigate("/");
    }

    const username = userInfo.username;
    const itemname = item.itemName;

    const response = await api.post(
      `${SERVER_HOST}/cart/additem`,
      {},
      {
        params: { username, itemname },
      }
    );

    const { status,data } = response;

    
    if(status === 201){
      setUserCartList([...userCartList,data])
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
      )
    } else{
      Swal.alert("Error", "저장에 실패했습니다.", "warning")
    }
    
    
        
  };

  const userListItemAxios = async () => {
    const response = await api.get(`${SERVER_HOST}/cart/${userInfo.id}/items`);
    const { data, status } = response;

    status === 200 && setUserItemList(data);
  };

  const userCartListItemAxios = async () => {
    const response = await api.get(
      `${SERVER_HOST}/cart/${userInfo.id}/cartitems`
    );
    const { data, status } = response;

    status === 200 && setUserCartList(data);
  };

  useEffect(() => {
    if (userInfo) {
      userCartListItemAxios();
      userListItemAxios();
    }
  }, []);

  return (
    <div className="searchItemList">
      {searchList.itemList &&
        searchList.itemList.map((item) => (
          <div key={item.id} className="searchItem">
            {item.itemType.includes("미니미") && (
              <div>
                <img
                  height={300}
                  src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                />
              </div>
            )}

            {skinAndSotryRoom.some((item2) =>
              item2.includes(item.itemType)
            ) && (
              <div>
                <img
                  className="skinAndStoryRoom"
                  src={`${process.env.PUBLIC_URL}/image/${item.fileName}`}
                />
              </div>
            )}

            {item.itemType.includes("글꼴") && (
              <div>
                <input
                  className="fontStyle"
                  type="text"
                  style={{
                    fontFamily: `${item.sourceName}, cursive`,
                    fontSize: 50,
                    textAlign: "center",
                  }}
                  value="AhCyWorld"
                  readOnly
                />
              </div>
            )}

            {item.itemType.includes("배경음악") && (
              <img className="itemImg searchItem" src={item.bgmImg} alt="" />
            )}

            {(item.itemType.includes("배경음악") && (
              <div style={{ fontSize: 30 }}>
                <span>
                  {item.sourceName}-{item.itemName}
                </span>
                <span>
                  {item.price} <img className="acorn-img" src={acorn} />
                </span>
              </div>
            )) ||
              (!item.itemType.includes("배경음악") && (
                <div style={{ fontSize: 30 }}>
                  <span>{item.itemName}</span>
                  <span>
                    {item.price} <img className="acorn-img" src={acorn} />
                  </span>{" "}
                </div>
              ))}

            {(userItemList &&
              userItemList.some((item2) => item2.item.id === item.id) && (
                <button className="pushItem">보유중</button>
              )) ||
              (userCartList &&
                userCartList.some((item2) => item2.item.id === item.id) && (
                  <button className="pushItem">담긴 아이템</button>
                )) || (
                <button className="pushItem" onClick={() => addCart(item)}>
                  장바구니추가
                </button>
              )}
          </div>
        ))}
    </div>
  );
};

export default ItemListItem;
