import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate를 import합니다.

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/user/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token); // 로컬 스토리지에 토큰 저장
      navigate("/db"); // 로그인 성공 후 '/db' 경로로 리디렉션합니다.
    } catch (error) {
      console.error("로그인 실패:", error.response?.data?.error || "서버 오류");
      alert("로그인 실패: " + (error.response?.data?.error || "서버 오류"));
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <div className="input-group">
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button onClick={handleLogin}>로그인</button>
      <style jsx>{`
        .login-container {
          max-width: 400px;
          margin: 50px auto;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          text-align: center;
          background-color: #f9f9f9;
        }
        h2 {
          color: #333;
        }
        .input-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          margin-bottom: 5px;
          font-size: 16px;
          color: #666;
        }
        input {
          width: calc(100% - 20px);
          padding: 10px;
          font-size: 14px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
        button {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 4px;
          background-color: #0056b3;
          color: white;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background-color: #004494;
        }
      `}</style>
    </div>
  );
}

export default Login;
