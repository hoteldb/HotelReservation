import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ReservationList from '../../Reservation/ReservationList';

function ReservationsPage() {
  const [reservations, setReservations] = useState([]); // 초기 예약 데이터는 빈 배열로 설정
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  if (!userId) {
  // 로그인되지 않았을 경우 로그인 페이지로 이동
    navigate("/login");
  }

  useEffect(() => {
    // 사용자의 예약 내역을 데이터베이스에서 가져오기
    axios.get(`http://localhost:5000/api/reservations?userId=${userId}`)
      .then((response) => {
        setReservations(response.data); // 서버에서 받아온 예약 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error('예약 내역을 가져오는 데 실패했습니다:', error);
      });
  }, [userId]); // userId가 변경될 때마다 데이터를 다시 가져옴

  const handleDelete = (id) => {
    setReservations(reservations.filter((res) => res.booking_id !== id)); // 예약 삭제
  };

  const handleRetry = (id) => {
    alert(`예약 ${id}를 다시 시도합니다.`);
  };

  return (
    <div>
      <h1 className="text-center">My 예약</h1>
      <ReservationList
        reservations={reservations}
        onDelete={handleDelete}
        onRetry={handleRetry}
      />
    </div>
  );
}

export default ReservationsPage;
