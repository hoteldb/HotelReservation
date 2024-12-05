import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage/HomePage";
import Login from "./SignUp/Login";
import SignUp from "./SignUp/SignUp";
import HotelInfo from "./HomePage/HotelList/HotelInfo";
import Payment from "./HomePage/Payment/Payment";
import PaymentConfirmation from "./HomePage/Payment/PaymentConfirmation";


function App() {
  return (
    <Router>
      <div>
        <header>
          <h1>Welcome to Our Application</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/hotel/:hotelId" element={<HotelInfo />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
