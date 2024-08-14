import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdLandingPage from "../Randing/AdLandingPage";

function CodePage() {
  const { code, urlCode } = useParams();
  const [codeData, setCodeData] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchCodeData = async () => {
      try {
        const hasClicked = localStorage.getItem(`clicked_${urlCode}`);

        // URL 코드로 데이터 가져오기
        const response = await axios.get(`/api/urlcode/${urlCode}`);
        const fetchedData = response.data;

        // code와 urlCode 모두 확인
        if (
          fetchedData.ad_number !== code ||
          fetchedData.url_code !== urlCode
        ) {
          setError("잘못된 경로입니다.");
        } else {
          setCodeData(fetchedData);

          // 로컬 스토리지에 클릭 기록 저장 및 1초 후 클릭 데이터 전송
          if (!hasClicked) {
            localStorage.setItem(`clicked_${urlCode}`, "true");

            setTimeout(async () => {
              try {
                const postResponse = await axios.post(
                  `/api/urlcode/${urlCode}`
                );
                console.log("Click data sent successfully:", postResponse.data);
              } catch (error) {
                console.error("Error sending click data:", error);
              }
            }, 5000);
          }
        }
      } catch (err) {
        setError("잘못된 경로입니다.");
      }
    };

    fetchCodeData();
  }, [code, urlCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    // 제출 로직
    // 로콜소로토로조삭제
  };

  if (error) {
    alert(error);
    return <div>{error}</div>;
  }

  if (!codeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {code === "001" && <AdLandingPage urlCode={urlCode} />}{" "}
      {/* {code === "002" && <AdLandingPage urlCode={urlCode} />}{" "} */}
      {code !== "001" && <p>해당 코드로는 특별한 이벤트가 없습니다.</p>}
    </div>
  );
}

export default CodePage;
