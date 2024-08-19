import React, { useContext, useEffect, useState } from "react";
import "../css/Minimi.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import "../css/Minimi.css";
import Cookies from 'js-cookie'
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

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

  const updateMinimi = async () => {
    let hompy = hompyInfo;
    hompy.minimiPicture = minimi;

  try{
    const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`,hompy,{
      headers:{
        'Authorization':'Bearer ' +Cookies.get('accessToken')
      }
    })
    
    const {data , status} = response;

    if (status === 200) {
      setHompyInfo(data);
      Swal.fire({
        icon: 'success',
        title: '성공!',
        text: '미니미가 변경되었습니다.',
        confirmButtonText: '확인'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: '실패',
        text: '업데이트 중 오류가 발생했습니다.',
        confirmButtonText: '확인'
      });
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: '실패',
      text: '업데이트 중 오류가 발생했습니다.',
      confirmButtonText: '확인'
    });
  }
};

  return (
    <div className="minimi-container">
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
      </div>
    </div>
        <div className="minimi-btn-container">
          <button className="minimi-save-btn" onClick={updateMinimi}>변경</button>
        </div>
  </div>
  );
};

export default Minimi;
