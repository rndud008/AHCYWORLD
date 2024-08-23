import React from "react";
import { useSelector } from "react-redux";
import "./UserListItem.style.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMarsStroke, faVenus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

const UserListItem = () => {
  const searchList = useSelector((state) => state.search.searchList);
  const accessToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  const miniHompyLink = (hompyId) => {
    if (accessToken) {
      window.open(
        `http://43.201.136.217:3000/hompy/${hompyId}`, // 열고 싶은 URL
        "_blank", // 새로운 창을 엽니다.
        "width=1700,height=825,menubar=no,toolbar=no,scrollbars=no,resizable=no" // 창의 크기 설정
      );
    } else {
      alert("로그인이 필요합니다.");
      navigate("/");
    }
  };

  return (
    <>
      {searchList.hompyList &&
        searchList.hompyList.map((item) => (
          <div key={item.id} className="userListItemDiv">
            <div className="userListItemDivImg">
              <img
                src={`${process.env.PUBLIC_URL}/image/${
                  item.minimiPicture || item.user.gender.toLowerCase() + ".png"
                }`}
              />
            </div>
            <div>
              <div className="userListItemDivInfo">
                <h2>{item.title}</h2>
                <Button className="user-hompy-go" onClick={() => miniHompyLink(item.id)}>
                  {" "}
                  바로가기
                </Button>
              </div>
              <div className="userListItemDivInfo">
                <div>
                  <span>{item.user.name}</span>
                  <span>
                    {item.user.gender.includes("MALE") ? (
                      <FontAwesomeIcon icon={faMarsStroke} />
                    ) : (
                      <FontAwesomeIcon icon={faVenus} />
                    )}
                  </span>
                </div>
                <div>
                  <span>todayVisitor: {item.todayVisitor} / </span>
                  <span>totalVisitor: {item.totalVisitor}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default UserListItem;
