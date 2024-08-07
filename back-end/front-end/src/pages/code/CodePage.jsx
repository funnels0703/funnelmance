// src/pages/code/CodePage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function CodePage() {
  const { urlCode } = useParams();
  const [codeData, setCodeData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        // URL 코드 검증 및 클릭 카운트 증가 요청
        const response = await axios.get(`/api/urlcode/${urlCode}`);

        setCodeData(response.data);
      } catch (err) {
        setError("잘못된 경로입니다.");
      }
    };

    fetchCodeData();
  }, [urlCode]);

  if (error) {
    alert(error);
    return <div>{error}</div>;
  }

  if (!codeData) {
    return <div>Loading...</div>;
  }

  return <div>랜딩페이지입니다 ~</div>;
}

export default CodePage;
