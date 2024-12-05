import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReservationPage from "./ReservationPage"; 
import './MyPage.css';

function MyPage() {
  const [activePage, setActivePage] = useState("profile");
  const [userName, setUserName] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  if (!userId) {
  // 로그인되지 않았을 경우 로그인 페이지로 이동
    navigate("/login");
  }

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  useEffect(() => {
    // 사용자 정보 가져오기
    axios
      .get(`http://localhost:5000/api/user-info?userId=${userId}`)
      .then((response) => {
        setUserName(response.data.username); // 사용자 이름 저장
      })
      .catch((error) => {
        console.error('사용자 정보 불러오기 실패:', error);
      });
  }, [userId]);


  return (
    <div className="my-page">
      <h1>마이페이지</h1>
      {userName ? (
        <h2>안녕하세요, {userName}님!</h2> // 사용자 이름 표시
      ) : (
        <p>로딩 중...</p> // 데이터가 로딩될 때 표시
      )}

      <div>
        <button onClick={() => handlePageChange("reservation")}>예약 내역</button>
        <button onClick={() => handlePageChange("settings")}>설정</button>
      </div>

      <div>
        {activePage === "reservation" && <ReservationPage />}
        {activePage === "settings" && <p>Settings</p>}
      </div>
    </div>
  );
}

export default MyPage;
