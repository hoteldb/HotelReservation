import React, { useState, useEffect } from 'react';
import ReviewModal from './ReviewModel';

function ReservationCard({ reservation, onDelete, onRetry }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);

  useEffect(() => {
    // 체크아웃 여부 계산
    const today = new Date();
    const checkoutDate = new Date(reservation.checkout_date);
    setIsCheckedOut(checkoutDate < today); // 오늘 날짜보다 이전이면 true
  }, [reservation.checkout_date]);

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  const handleSubmitReview = (data) => {
    console.log('리뷰 데이터:', {
      hotelName: reservation.hotel_name,
      imageUrl: reservation.hotel_image_url,
      ...data,
    });
    alert('리뷰가 등록되었습니다.');
    setShowReviewModal(false);
  };

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      {/* 이미지 영역 */}
      <div
        style={{
          flex: '0 0 250px',
          height: '250px',
          marginRight: '15px',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        <img
          src={reservation.hotel_image_url}
          alt={reservation.hotel_name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      {/* 텍스트 정보 영역 */}
      <div style={{ flex: '1' }}>
        <h5 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
          {reservation.hotel_name} - {reservation.room_name}
        </h5>
        <p style={{ margin: '5px 0' }}>예약번호: {reservation.booking_id}</p>
        <p style={{ margin: '5px 0' }}>예약일자: {reservation.booking_date}</p>
        <p style={{ margin: '5px 0' }}>
          숙박기간: {reservation.checkin_date} ~ {reservation.checkout_date}
        </p>
        <p style={{ margin: '5px 0' }}>예약자: {reservation.user_id}</p>
        <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#007bff' }}>
          가격: {reservation.price_range.toLocaleString()}원
        </p>

        {/* 체크아웃 상태 표시 */}
        {isCheckedOut ? (
          <p style={{ color: 'green', fontWeight: 'bold', marginTop: '10px' }}>
            체크아웃 완료
          </p>
        ) : (
          <p style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
            체크아웃 미완료
          </p>
        )}

        {/* 버튼 영역 */}
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button className="button" onClick={() => onRetry(reservation.booking_id)}>
            다시 예약
          </button>
          <button className="button button-danger" onClick={() => onDelete(reservation.booking_id)}>
            예약 취소
          </button>
          <button
            className="button"
            onClick={handleOpenReviewModal}
            disabled={!isCheckedOut}
            style={{
              backgroundColor: isCheckedOut ? '#007bff' : '#ccc',
              cursor: isCheckedOut ? 'pointer' : 'not-allowed',
            }}
          >
            리뷰 쓰기
          </button>
        </div>
      </div>

      {/* 리뷰 모달 */}
      <ReviewModal
        show={showReviewModal}
        onClose={handleCloseReviewModal}
        reservation={reservation}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}

export default ReservationCard;
