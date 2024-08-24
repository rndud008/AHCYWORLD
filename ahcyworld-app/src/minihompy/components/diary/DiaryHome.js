import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./css/CalendarStyles.css";
import moment from "moment-timezone";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import DiaryModal from "./DiaryModal";
import api, { SERVER_HOST } from "../../../apis/api";
import { LoginContext } from "../../../webpage/components/login/context/LoginContextProvider";
import Layout from "../Layout/Layout";
import { Button } from "react-bootstrap";
import * as Swal from "../../../apis/alert";
import Cookies from "js-cookie";

const DiaryHome = () => {
    const curDate = new Date();
    const [value, onChange] = useState(curDate); // 클릭한 날짜(초기값으로는 현재 날짜)
    // diary에 있는 값
    const [dayList, setDayList] = useState([]);

    // 다이어리 가져오는 값
    // const [showDiaryForm, setShowDiaryForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [diaryContent, setDiaryContent] = useState(null);
    const navigate = useNavigate();
    const { hompyInfo, userInfo } = useContext(LoginContext);
    const { hompyId } = useParams();
    const [hompy, setHompy] = useState("");

    const cookie = Cookies.get("accessToken"); 

    const fetchDiaries = () => {
        axios({
            method: "get",
            url: `${SERVER_HOST}/cyworld/cy/diaries/list/${hompyId}/${hompy.user.id}`,
        })
            .then((response) => {
                const diaries = response.data;

                const formattedDates = diaries.map((diary) => {

                    const localDate = moment(new Date(diary.eventDate)).format("YYYY-MM-DD");

                    return localDate;
                });
                // setHompy(diaries);
                setDayList(formattedDates);

            })
            .catch((error) => {
                console.error("diary 없음...", error);
            });

    };

    const fetchHompy = async () => {
        try{
            const respone = await api.get(`${SERVER_HOST}/hompy/${hompyId}`,{
                headers: {
                    "Authorization": `Bearer ${cookie}`,
                }
            });
            setHompy(respone.data);

        }catch(error){
            console.error("홈피 정보 불러오기 실패", error)
        }
    };

    // 로딩시 초기
    useEffect(() => {
        // if(userInfo.id === hompyInfo.user.id){
        if(hompyId){
            fetchHompy();
        }
        // }
    }, [hompyId]);

    useEffect(()=>{
        if(hompy){

            fetchDiaries();   
        }
    },[hompy])

    // 현재시간의 월
    const monthOfActiveDate = moment(value).format("YYYY-MM");
    const [activeMonth, setActiveMonth] = useState(monthOfActiveDate); // 초기값으로 현재의 달을 넣어줌

    // 받아오는 인자(activeStartDate)에 따라 현재 보여지는 달(activeMonth)의 State를 변경
    const getActiveMonth = (activeStartDate) => {
        const newActiveMonth = moment(activeStartDate).format("YYYY-MM");
        setActiveMonth(newActiveMonth);
    };

    // 각 날짜 타일에 컨텐츠 추가
    const addContent = ({ date, view }) => {
        if (view !== "month") {
            return null;
        }
        const formattedDate = moment(date).format("YYYY-MM-DD");


        // date(각 날짜)가 리스트의 날짜와 일치하면 해당 컨텐츠(이모티콘)을 추가
        if (dayList.includes(formattedDate)) {

            return <div key={formattedDate}>⭐️</div>;
        }
        return null;
    };

    // 날짜 클릭 핸들러
    const handleDateClick = (date) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        setSelectedDate(formattedDate);

            axios
                .get(
                    `${SERVER_HOST}/cyworld/cy/diaries/detail-by-date/${formattedDate}`
                )
                .then((response) => {
                    const diaries = response.data;

                    const filteredDiaries = diaries.filter(diary => diary.hompy.id === parseInt(hompyId));
                    

                    setDiaryContent(filteredDiaries.length > 0 ? filteredDiaries : null);
                    setShowModal(true);
                })
                .catch((error) => {
                    setDiaryContent(null);
                    setShowModal(true);
                    console.error(
                        "다이어리 내용을 가져오는데 실패 했습니다.",
                        error
                    );
                });        
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setDiaryContent(null);
    };

    const handleWriteClick = () => {
        if(hompyInfo.id === parseInt(hompyId)){
            navigate(`/hompy/${hompyInfo.id}/diary/write`, {
                state: {date: selectedDate},
            });
        }else{
            Swal.alert("작성 권한이 없습니다.", "작성 권한이 없는 유저입니다.", "warning", () => {return})
        }
        
    };

    const moveToToday = () => {
        const today = new Date();
        onChange(today);
        setActiveMonth(moment(today).format("YYYY-MM-DD"));
    }

    return (
        <>
            <div className="calendar-container">
                <Calendar
                    locale="en-US"
                    onChange={onChange}
                    value={value}
                    next2AriaLabel={null} // 년 단위로 이동 버튼
                    prev2AriaLabel={null} // 년 단위로 이동 버튼
                    formatDay={(locale, date) => moment(date).format("D")} // 날짜형태 바꾸는 함수
                    tileContent={addContent} // 날짜 칸에 보여지는 콘텐츠
                    showNeighboringMonth={false} // 앞 뒤 달의 이어지는 날짜 보여주기 여부
                    onActiveStartDateChange={(
                        { activeStartDate } // 활성화된 (현재 보여지는) 년, 월, 일이 변경될 때마다 실행
                    ) => getActiveMonth(activeStartDate)}
                    onClickDay={handleDateClick} // 날짜 클릭 시 핸들러
                    activeStartDate={new Date(activeMonth)}
                />
                <button className="move-to-today" onClick={moveToToday}>오늘로 이동</button>
                <DiaryModal
                    show={showModal}
                    onHide={handleCloseModal}
                    selectedDate={selectedDate}
                    diaryContent={diaryContent}
                    onWriteClick={handleWriteClick}
                    />
            </div>

        </>
    );
};

export default DiaryHome;
