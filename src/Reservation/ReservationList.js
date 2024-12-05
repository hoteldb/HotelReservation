import React from 'react';
import ReservationCard from './ReservationCard';

function ReservationList({ reservations, onDelete, onRetry }) {
  return (
    <div className="container">
      {reservations.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onDelete={onDelete}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}

export default ReservationList;