import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  if (!userId) {
  // 로그인되지 않았을 경우 로그인 페이지로 이동
    navigate("/login");
  }

  useEffect(() => {
    // 장바구니 정보 가져오기
    axios
      .get(`http://localhost:5000/api/cart/${userId}`)
      .then((response) => {
        setCartItems(response.data); // 장바구니 정보 상태에 저장
      })
      .catch((error) => {
        console.error("장바구니 데이터 불러오기 실패:", error);
      });
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니에 담긴 상품이 없습니다.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.cart_id} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* 체크박스 */}
              <input type="checkbox" style={{ marginRight: '15px' }} />

              {/* 호텔 이미지 (정사각형 모양) */}
              <img
                src={item.hotel_image_url || '/default-hotel-image.jpg'}
                alt={item.hotel_name}
                style={{
                  width: '400px',
                  height: '250px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginRight: '15px',
                }}
              />

              {/* 호텔 정보 */}
              <div style={{ flex: 1 }}>
                <h3>{item.hotel_name}</h3>
                <p>{item.city_name}, {item.country_name}</p>
                <p>💰 1박 가격: {item.price_range}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
