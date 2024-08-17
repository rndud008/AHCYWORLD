import React, { useContext, useEffect, useState } from "react";
import "../css/Minimi.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import "./Minimi.style.css";
import Cookies from 'js-cookie'
import { useParams } from "react-router-dom";

const Minimi = () => {
  const { userInfo, hompyInfo, setHompyInfo } = useContext(LoginContext);
  const [minimiItems, setMinimiItems] = useState([]);
  const {hompyId} = useParams();

  const genderCheck = (gender) => {
    if (gender.includes("MALE") || gender.includes("남자")) {
      return "male.png";
    }

    if (gender.includes("FEMALE") || gender.includes("여자")) {
      return "female.png";
    }
  };

  const [minimi, setMinimi] = useState(
    hompyInfo.minimiPicture || genderCheck(hompyInfo.user.gender)
  );

  useEffect(() => {
    let type = "미니미";
    let minimis = [];
    const userItemLits = async () => {
      const response = await axios({
        method: "GET",
        url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
      });

      response.data.forEach((cart) => {
        if (cart.item.itemType === type) {
          minimis.push(cart.item);
        }
      });
      setMinimiItems(minimis);
    };
    userItemLits();
  }, []);

  const updateMinimi = () => {
    let hompy = hompyInfo;
    hompy.minimiPicture = minimi;

    const response = api.post(`${SERVER_HOST}/hompy/${hompyId}`,hompy,{
      headers:{
        'Authorization':'Bearer ' +Cookies.get('accessToken')
      }
    })
    
    const {data , status} = response;

    if(status === 200){
      setHompyInfo(data)
    }
  };

  return (
    <div className="minimi-container">
      <div>
        <h1>미니미 설정</h1>
      </div>
      <div className="aaa">
        <div className="afterSelectMinimi">
          <img src={`/image/${minimi}`} />
        </div>
        <div className="selectMinimiList">
          <div className="beforeSelectMinimi">
            <div>
              <img onClick={() =>setMinimi(genderCheck(hompyInfo.user.gender))} src={`/image/${genderCheck(hompyInfo.user.gender)}`} />{" "}
              <div>
                <input
                  type="radio"
                  id="default"
                  name="minimi"
                  value={genderCheck(hompyInfo.user.gender)}
                  onChange={(e) => setMinimi(e.target.value)}
                  checked={genderCheck(hompyInfo.user.gender) === minimi}
                />{" "}
                <label htmlFor="default">기본 미니미</label>
              </div>
            </div>

            {minimiItems &&
              minimiItems.map((item) => (
                <div>
                  <img onClick={() =>setMinimi(item.fileName)} src={`/image/${item.fileName}`} />{" "}
                  <div>
                    <input
                      type="radio"
                      id={item.id}
                      name="minimi"
                      value={item.fileName}
                      onChange={(e) => setMinimi(e.target.value)}
                      checked={item.fileName === minimi}
                    />{" "}
                    <label htmlFor={item.id}>{item.itemName}</label>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={updateMinimi}>변경</button>
        </div>
      </div>
    </div>
  );
};

export default Minimi;
