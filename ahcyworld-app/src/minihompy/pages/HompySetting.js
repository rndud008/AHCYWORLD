import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../pages/css/HompySetting.css";
import HompySettingLeft from "./HompySettingLeft";



const HompySetting = () => {
  const { hompyId } = useParams();
  const [hompy, setHompy] = useState(null);

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

  return (
    <Layout
      hompy={hompy}
      user={hompy.user}
      LeftPanelComponent={HompySettingLeft}
      showTitle={false}
      showVisitorInfo={false}
    >
      <div className="setting_container"></div>
    </Layout>
  );
};

export default HompySetting;
