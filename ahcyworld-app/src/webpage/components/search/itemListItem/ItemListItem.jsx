import React, { useContext } from "react";
import { useSelector } from "react-redux";
import acorn from "../../../../upload/acorn.png";
import axios from "axios";
import * as Swal from "../../../../apis/alert";
import { SERVER_HOST } from "../../../../apis/api";
import { LoginContext } from "../../login/context/LoginContextProvider";
import { useNavigate } from "react-router-dom";
import "./ItemListItem.style.css";

const ItemListItem = () => {
  const searchList = useSelector((state) => state.search.searchList);
  const { userInfo } = useContext(LoginContext);
  const navigate = useNavigate();

  console.log("ItemListItem", searchList);

  const skinAndSotryRoom = ["스킨", "스토리룸"];

  const addCart = (item) => {
    axios({
      method: "POST",
      url: `${SERVER_HOST}/cart/additem`,
      params: {
        username: userInfo.username,
        itemname: item.itemName,
      },
    }).then((response) => {
      const { data, status, error } = response;
      if (status === 201) {
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
      } else {
        window.alert("실패! : " + error);
      }
    });
  };

  return (
    <div className="searchItemList">
      {searchList.itemList &&
        searchList.itemList.map((item) => (
          <div  className="searchItem">
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
                  <sapn>
                    {item.price} <img className="acorn-img" src={acorn} />
                  </sapn>{" "}
                </div>
              ))}
            <button className="pushItem" onClick={() => addCart(item)}>
              장바구니추가
            </button>
          </div>
        ))}
    </div>
  );
};

export default ItemListItem;
