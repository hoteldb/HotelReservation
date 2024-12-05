import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelImage, hotelName, roomName, checkInDate, checkOutDate, price } =
    location.state || {};

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#28a745', marginBottom: '20px' }}>결제가 확정되었습니다!</h1>
      <div
        style={{
          display: 'flex',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '15px',
          alignItems: 'center',
        }}
      >
        {/* 호텔 이미지 */}
        <img
          src={hotelImage || '/default-hotel-image.jpg'}
          alt={hotelName}
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginRight: '20px',
          }}
        />
        {/* 호텔 정보 */}
        <div>
          <h3 style={{ margin: '5px 0' }}>{hotelName}</h3>
          <p style={{ margin: '5px 0' }}>객실명: {roomName}</p>
          <p style={{ margin: '5px 0' }}>
            기간: {checkInDate} ~ {checkOutDate}
          </p>
          <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#007bff' }}>
            가격: {price}원
          </p>
        </div>
      </div>

    {/* 홈으로 버튼 */}
    <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        홈으로
      </button>
    </div>
  );
}

export default PaymentConfirmation;
