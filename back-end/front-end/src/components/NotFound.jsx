// src/components/NotFound.js
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - 페이지를 찾을 수 없습니다.</h1>
      <p>홈 페이지로 돌아가려면 아래 버튼을 클릭하세요.</p>
      <Link to="/">
        <button>홈으로 돌아가기</button>
      </Link>
      <style jsx>{`
        .not-found {
          text-align: center;
          margin-top: 50px;
        }
        h1 {
          font-size: 2em;
          color: #333;
        }
        p {
          font-size: 1.2em;
          color: #666;
        }
        button {
          padding: 10px 20px;
          font-size: 1em;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
