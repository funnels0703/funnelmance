import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate를 import합니다.
import "./login.scss";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // 로그인 상태 유지 체크박스 상태

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/user/login", {
        username,
        password,
      });

      const { token } = response.data;

      if (rememberMe) {
        localStorage.setItem("token", token); // 체크박스가 선택되었을 때만 토큰 저장
      } else {
        sessionStorage.setItem("token", token); // 선택되지 않았을 때는 sessionStorage에 저장
      }

      navigate("/db"); // 로그인 성공 후 '/db' 경로로 리디렉션합니다.
    } catch (error) {
      console.error("로그인 실패:", error.response?.data?.error || "서버 오류");
      alert("로그인 실패: " + (error.response?.data?.error || "서버 오류"));
    }
  };

  return (
    <div className="login-container">
      <h2>
        <img src="/images/logo.png" alt="퍼널스" />
      </h2>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        placeholder="아이디"
      />
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="비밀번호"
      />

      <label className="remember_me">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)} // 체크박스 상태 변경
        />
        로그인 상태 유지
      </label>

      <button onClick={handleLogin}>로그인</button>

      <p className="copyright">
        Copyright © Funnel Solution All Rights Reserved.
      </p>
    </div>
  );
}

export default Login;
