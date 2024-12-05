import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [likeType, setLikeType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    try {
      // 전송할 데이터 로그 출력
      console.log({
        email,
        username,
        password,
        like_type: likeType
      });
  
      const response = await axios.post("http://localhost:5000/signup", {
        email,
        username,
        password,
        like_type: likeType
      });
  
      alert("회원가입이 완료되었습니다.");
    } catch (error) {
      console.error("API 요청 오류:", error); // 오류 로그 출력
      setErrorMessage("회원가입 중 오류가 발생했습니다.");
    }
  };
  

  return (
    <div className="signup-container">
      <h1>회원 가입을 위해 정보를 입력해주세요</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>* 이메일</label>
        <input
          type="email"
          placeholder="이메일"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>* 이름</label>
        <input
          type="text"
          placeholder="이름"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>* 비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>* 비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호 확인"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="terms">
          <label>이용약관 개인정보 수집 및 이용, 마케팅 활용 선택에 모두 동의합니다.</label>
          <div className="checkbox-container">
            <input type="checkbox" required />
          </div>
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <button type="submit" className="signup-button">
          가입하기
        </button>
      </form>
    </div>
  );
};

export default Signup;
