import React, { useEffect, useState } from "react";
import axios from "axios";
// import { FaShoppingCart, FaUserCircle } from "react-icons/fa"; // 아이콘 추가
import HotelList from "./HotelList/HotelList";
import MyPage from "./MyPage/MyPage";
import Cart from "./Cart/Cart";
import Signup from "../SignUp/SignUp";
import Login from "../SignUp/Login";
import "./HomePage.css"; // 스타일 추가

function HomePage() {
  const [activeTab, setActiveTab] = useState("hotels");
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const response = await axios.get("http://localhost:5000/hotels");
      setHotels(response.data);
    } catch (error) {
      console.error("호텔 정보를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <div className="HomePage">
      <header className="header">
        <div className="logo-container">
          <h1 className="title">호텔 예약 시스템</h1>
        </div>
        <nav className="nav-bar">
          <button
            className={`nav-button ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => setActiveTab("hotels")}
          >
            호텔 목록
          </button>
          <button
            className={`nav-button ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
          장바구니
          </button>
          <button
            className={`nav-button ${activeTab === "mypage" ? "active" : ""}`}
            onClick={() => setActiveTab("mypage")}
          >
          마이페이지
          </button>
          <button
            className={`nav-button ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            회원가입
          </button>
          <button
            className={`nav-button ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            로그인
          </button>
        </nav>
      </header>

      <main className="tab-content">
        {activeTab === "hotels" && <HotelList hotels={hotels} />}
        {activeTab === "cart" && <Cart />}
        {activeTab === "mypage" && <MyPage />}
        {activeTab === "signup" && <Signup />}
        {activeTab === "login" && <Login />}
      </main>
    </div>
  );
}

export default HomePage;
