import React, { useState } from "react";
import axios from "axios";

function AdLandingPage({ urlCode }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`/api/customor`, {
        urlCode,
        ...formData,
      });
      console.log("Data submitted successfully:", response.data);
      setSubmitted(true);
      localStorage.removeItem(`clicked_${urlCode}`);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  if (submitted) {
    return <div>감사합니다! 제출이 완료되었습니다.</div>;
  }

  return (
    <div className="ad-landing-page container">
      <h2>광고 랜딩 페이지</h2>
      <p>아래 정보를 입력해 주세요.</p>
      <div className="input-group">
        <label>이름:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="input-group">
        <label>전화번호:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>
      {/* <div className="input-group">
        <label>시술:</label>
        <input
          type="text"
          name="procedure"
          value={formData.procedure}
          onChange={handleInputChange}
          required
        />
      </div> */}
      <button className="submit-button" onClick={handleSubmit}>
        제출하기
      </button>

      <style jsx>{`
        .ad-landing-page {
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        h2 {
          margin-bottom: 10px;
        }

        .input-group {
          margin-bottom: 10px;
        }

        label {
          display: block;
          margin-bottom: 5px;
        }

        input {
          padding: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        .submit-button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
          margin-top: 20px;
          width: 100%;
        }

        .submit-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}

export default AdLandingPage;
