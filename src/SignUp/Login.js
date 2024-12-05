import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [successMessage, setSuccessMessage] = useState(""); // 성공 메시지 상태
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      console.log("로그인 응답:", response.data);

      if (response.data.success) {
        // user_id 저장 및 페이지 이동
        localStorage.setItem("userId", response.data.userId); // user_id 저장
        setSuccessMessage("로그인에 성공했습니다!"); // 성공 메시지 설정
        setTimeout(() => navigate("/"), 2000); // 2초 후 홈으로 이동
      } else {
        setErrorMessage("로그인 실패: " + response.data.message); // 에러 메시지 설정
      }
    } catch (err) {
      console.error("로그인 오류:", err);
      setErrorMessage("서버 오류: 로그인 요청에 실패했습니다."); // 에러 메시지 설정
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="email address"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p className="signup-link" onClick={() => navigate("/signup")}>
          Sign Up
        </p>
      </div>
    </div>
  );
};

export default Login;
