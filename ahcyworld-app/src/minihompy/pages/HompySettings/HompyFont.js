import React, { useContext, useEffect, useState } from "react";
import "../css/HompyFont.css";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import axios from "axios";
import api, { SERVER_HOST } from "../../../apis/api";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import "../css/HompyFont.css";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { HompyAction } from "../../../redux/actions/HompyAction";

const HompyFont = () => {
  const { hompyId } = useParams();
  const { userInfo, hompyInfo, setHompyInfo } = useContext(LoginContext);
  const [fontItems, setFontItems] = useState([]);
  const [selectedFont, setSelectedFont] = useState(hompyInfo.miniHompyFont || "Arial");
  const dispatch = useDispatch();

  useEffect(() => {
    let type = "글꼴";
    let fonts = [
      {
        itemName: "기본",
        sourceName: "Arial",
        itemType: "글꼴",
      },
    ];
    const userItemLits = async () => {
      const response = await axios({
        method: "GET",
        url: `${SERVER_HOST}/cart/${userInfo.id}/items`,
      });
      response.data.forEach((cart) => {
        if (cart.item.itemType === type) {
          fonts.push(cart.item);
        }
      });
      setFontItems(fonts);
    };
    userItemLits();
  }, []);

  const handleFontSave = async (fontName) => {
    let hompy = hompyInfo;
    hompy.miniHompyFont = fontName;

    try {
      const response = await api.post(`${SERVER_HOST}/hompy/${hompyId}`, hompy, {
        headers: {
          Authorization: "Bearer " + Cookies.get("accessToken"),
        },
      });

      const { data, status } = response;

      if (status === 200) {
        dispatch(HompyAction.hompyUpdate(data));
        // setHompyInfo(data);
        Swal.fire({
          icon: "success",
          title: "성공!",
          text: "폰트가 변경되었습니다.",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "실패",
          text: "업데이트 중 오류가 발생했습니다.",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "실패",
        text: "업데이트 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="hompyFont-container">
      <div className="font-selection">
        {fontItems &&
          fontItems.map((font) => (
            <div
              className="font-item"
              key={font.sourceName}
            >
              <label>
                <input
                  className="fontsetting-input"
                  type="radio"
                  name="fontSelect"
                  value={font.sourceName}
                  checked={selectedFont === font.sourceName}
                  onChange={() => setSelectedFont(font.sourceName)}
                />
                <div
                  className="fontStyle"
                  style={{
                    fontFamily: `${font.sourceName}, cursive`,
                    fontSize: "26px",
                  }}
                >
                  <div>{font.itemName}</div> {/* 폰트의 아이템 이름을 표시 */}
                  <div>Ahcyworld</div> {/* 미리보기 텍스트 */}
                </div>
              </label>
              <button
                className="fontsetting-btn"
                onClick={() => handleFontSave(font.sourceName)}
                disabled={selectedFont !== font.sourceName}
              >
                저장
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HompyFont;
