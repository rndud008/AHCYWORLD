import React, { useEffect, useState } from "react";
import "./SearchPage.style.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import UserListItem from "./userListItem/UserListItem";
import ItemListItem from "./itemListItem/ItemListItem";
import { SearchAction } from "../../../redux/actions/SearchAction";
import { Button } from "react-bootstrap";

const SearchPage = () => {
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const actionQuery = params.get("action");
  const searchQuery = params.get("search");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [show, setShow] = useState({
    itemList: false,
    hompyList: true,
  });

  const searchList = useSelector((state) => state.search.searchList);



  useEffect(() => {
    if (actionQuery && searchQuery) {
      refresh();
    }
  }, []);

  const refresh = async () => {
    try {
      await dispatch(
        SearchAction.searchListAxios(searchQuery, actionQuery, navigate)
      );
    } catch (e) {
      alert(e.response.data);
    }
  };

  const showChangeValue = (e) =>{
    const {name} = e.target;
    if(name.includes("hompy")){
      setShow({hompyList:true,itemList:false})
    }
    if(name.includes("item")){
      setShow({itemList:true,hompyList:false})
    }
  }

  return (
    <div className="searchPage-div">
      {actionQuery === "people" && <UserListItem />}

      {actionQuery === "item" && <ItemListItem />}

      {actionQuery === "all" && (
        <>
          <div className="searchPageButtonGroup">
            <Button name="hompy" onClick={showChangeValue}>유저</Button>
            <Button name="item" onClick={showChangeValue}>아이템</Button>
          </div>
          {show.hompyList &&(searchList.hompyList?.length > 0 && <UserListItem />) ||
            show.hompyList &&(searchList.hompyList?.length === 0 && (
              <div className="searchPageNotFound"> 유저 검색결과가 없습니다.</div>
            ))}

          {show.itemList && (searchList.itemList?.length > 0 && <ItemListItem />) ||
            show.itemList && (searchList.itemList?.length === 0 && (
              <div className="searchPageNotFound"> 아이템 검색결과가 없습니다.</div>
            ))}

        </>
      )}
    </div>
  );
};

export default SearchPage;
