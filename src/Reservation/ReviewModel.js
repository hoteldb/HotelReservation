import React, { useState } from 'react';

function ReviewModal({ show, onClose, reservation, onSubmit }) {
  const [rating, setRating] = useState(0); // 별점 상태 관리
  const [hoveredRating, setHoveredRating] = useState(0); // 드래그 중인 별점
  const [review, setReview] = useState(''); // 리뷰 텍스트 상태 관리
  const [isFixed, setIsFixed] = useState(false); // 별점 고정 상태 관리

  if (!show) return null; // 모달이 닫혀 있으면 렌더링하지 않음

  // 별점 클릭 시 고정
  const handleStarClick = (index) => {
    setRating(index + 1);
    setHoveredRating(0);
    setIsFixed(true); // 별점 고정
  };

  // 별점 드래그 중
  const handleStarHover = (index) => {
    if (!isFixed) setHoveredRating(index + 1); // 고정되지 않은 경우만 드래그 반응
  };

  // 리뷰 등록 버튼 클릭
  const handleSubmit = () => {
    if (rating === 0 || review.trim() === '') {
      alert('별점과 리뷰를 모두 입력해주세요.');
      return;
    }
    onSubmit({ rating, review }); // 별점과 리뷰를 전달
    setRating(0); // 초기화
    setReview(''); // 초기화
    setIsFixed(false); // 별점 고정 상태 초기화
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          width: '400px',
          padding: '40px',
        }}
      >
        {/* 호텔 이름 및 사진 */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={reservation.hotel_image_url}
            alt={reservation.hotel_name}
            style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
          />
          <h3 style={{ marginTop: '10px' }}>{reservation.hotel_name}</h3>
        </div>

        {/* 별점 등록 */}
        <h4>리뷰 작성</h4>
        <p>별점 등록</p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <span
              key={index}
              onMouseEnter={() => handleStarHover(index)} // 드래그로 별점 선택
              onClick={() => handleStarClick(index)} // 클릭 시 별점 고정
              style={{
                fontSize: '32px',
                color: index < (isFixed ? rating : hoveredRating) ? '#00bfa5' : '#ccc',
                transition: 'color 0.2s',
              }}
            >
              ★
            </span>
          ))}
        </div>

        {/* 리뷰 작성 입력 */}
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)} // 리뷰 텍스트 상태 업데이트
          style={{
            width: '100%',
            height: '100px',
            borderRadius: '8px', // 둥글기
            border: '1px solid #ccc',
            padding: '10px',
            fontSize: '14px',
            resize: 'none',
          }}
          placeholder="리뷰를 작성해주세요"
        ></textarea>

        {/* 버튼 영역 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#fff',
              color: '#000',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#6200ee',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;