import React, { useState } from "react";
import "./HotelList.css";
import { useNavigate } from "react-router-dom";

function HotelList({ hotels }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); // 장바구니 상태

  // 장바구니에 추가하는 함수
  const addToCart = (hotel) => {
    console.log("addToCart 호출됨 - hotel:", hotel); // 디버깅 로그
    setCart((prevCart) => {
      console.log("이전 장바구니 상태:", prevCart); // 이전 상태 디버깅
      const isAlreadyInCart = prevCart.some((item) => item.hotel_id === hotel.hotel_id);
      if (isAlreadyInCart) {
        alert("이미 장바구니에 추가된 호텔입니다!");
        console.log("이미 장바구니에 추가된 호텔:", hotel.hotel_id); // 중복 로그
        return prevCart;
      }
      alert(`${hotel.hotel_name}이(가) 장바구니에 추가되었습니다!`);
      const updatedCart = [...prevCart, hotel];
      console.log("업데이트된 장바구니 상태:", updatedCart); // 업데이트된 상태 디버깅
      return updatedCart;
    });
  };

  const groupedHotels = hotels.reduce((acc, hotel) => {
    const type = hotel.hotel_type_name; // 호텔 유형
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(hotel);
    return acc;
  }, {});

  return (
    <div className="hotel-list">
      {Object.entries(groupedHotels).map(([type, hotels]) => (
        <div key={type} className="hotel-type-group">
          <h2 className="hotel-type-header">{type}</h2>
          <div className="hotel-cards">
            {hotels.map((hotel) => (
              <div key={hotel.hotel_id} className="hotel-card">
                <img
                  src={hotel.hotel_image_url || "/default-hotel-image.jpg"} // 기본 이미지 설정
                  alt={hotel.hotel_name}
                  className="hotel-image"
                />
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.hotel_name}</h3>
                  <p className="hotel-rating">
                    ⭐ {hotel.rating_avg || "N/A"}
                  </p>
                  <p className="hotel-price">
                    💰 {hotel.price_range || "Unknown"}
                  </p>
                </div>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "5px 10px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    console.log("예약하기 버튼 클릭 - hotel:", hotel); // 디버깅 로그
                    navigate(`/hotel/${hotel.hotel_id}`); // 올바른 경로로 이동
                  }}
                >
                  예약하기
                </button>
                <button
                  style={{
                    marginTop: "10px",
                    marginLeft: "5px",
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => addToCart(hotel)}
                >
                  장바구니 담기
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 장바구니 UI */}
      <div className="cart-container">
        <h2>장바구니</h2>
        {cart.length === 0 ? (
          <p>장바구니가 비어 있습니다.</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.hotel_id} className="cart-item">
                {item.hotel_name} - {item.price_range || "Unknown"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HotelList;
