import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./css/HompySetting.css";
import HompySettingLeft from "./HompySettingLeft";
import BasicInfo from "./HompySettings/BasicInfo";
import MenuSetting from "./HompySettings/MenuSetting";
import FriendShip from "./HompySettings/FriendShip";
import HompySkin from "./HompySettings/HompySkin";
import HompyFont from "./HompySettings/HompyFont";
import HompyMusic from "./HompySettings/HompyMusic";
import Minimi from "./HompySettings/Minimi";
import MiniRoom from "./HompySettings/MiniRoom";



const HompySetting = () => {
  const { hompyId } = useParams();
  const [hompy, setHompy] = useState(null);
  const [activeMenu, setActiveMenu] = useState("basicInfo");

  useEffect(() => {
    axios
      .get(`http://localhost:8070/hompy/${hompyId}`)
      .then((response) => {
        setHompy(response.data);
      })
      .catch((error) => {
        console.error("에러: 프로필을 가져 올 수 없음", error);
      });
  }, [hompyId]);

  if (!hompy || !hompy.user) {
    return <div>유효한 홈피 데이터를 불러올 수 없습니다.</div>;
  }

  // 메뉴관리
  const settingContent = () => {
    switch (activeMenu) {
      case "basicInfo":
        return <BasicInfo user={hompy.user} />;
      case "menu":
        return <MenuSetting />;
      case "friendShip":
        return <FriendShip user={hompy.user} />;
      case "hompySkin":
        return <HompySkin />;
      case "hompyFont":
        return <HompyFont />;
      case "miniRoom":
        return <MiniRoom />;
      case "minimi":
        return <Minimi />;
      case "hompyMusic":
        return <HompyMusic />;
      default:
        return <BasicInfo user={hompy.user} />;
    }
  };

  return (
    <Layout
      hompy={hompy}
      user={hompy.user}
      LeftPanelComponent={() => (<HompySettingLeft setActiveMenu={setActiveMenu} />)}
      showTitle={false}
      showVisitorInfo={false}
    >
      <div className="setting_container">
      {settingContent()}
      </div>
    </Layout>
  );
};

export default HompySetting;
