// src/components/CodeGenerator.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../../components/TitleBox";

const CodeGenerator = () => {
  const [formData, setFormData] = useState({
    ad_title: "",
    ad_number: "",
    hospital_name: "",
    event_name: "",
    advertising_company: "",
    url_code: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form
  useEffect(() => {
    // Check if all fields are filled
    const isValid = Object.values(formData).every(
      (value) => value.trim() !== ""
    );
    setIsFormValid(isValid);
  }, [formData]);

  // Random code generator
  // const generateRandomCode = () => {
  //   const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //   let result = "";
  //   for (let i = 0; i < 6; i++) {
  //     result += characters.charAt(
  //       Math.floor(Math.random() * characters.length)
  //     );
  //   }
  //   setFormData({ ...formData, url_code: result });
  // };

  // Data submit handler
  const handleSubmit = async () => {
    // 랜덤 코드 생성
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    console.log(result);
    // 랜덤 코드가 포함된 새로운 데이터 객체 생성
    const dataToSubmit = { ...formData, url_code: result };

    // 데이터 전송
    try {
      const response = await axios.post("/api/urlcode", dataToSubmit);
      console.log("Data successfully posted:", response.data);
      alert("코드 생성했습니다");
    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response && error.response.status === 400) {
        alert("중복된 코드입니다. 다시 생성해 주세요.");
      } else {
        alert("데이터 전송 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="code-generator container">
      <TitleBox mainmenu="코드 생성" />
      <div className="code_form">
        <div className="input-group">
          <label>랜딩 제목</label>
          <input
            type="text"
            name="ad_title"
            value={formData.ad_title}
            onChange={handleChange}
            placeholder="광고 제목"
            required
          />
        </div>
        <div className="input-group">
          <label>랜딩 번호</label>
          <input
            type="text"
            name="ad_number"
            value={formData.ad_number}
            onChange={handleChange}
            placeholder="광고 번호"
            required
          />
        </div>
        <div className="input-group">
          <label>병원</label>
          <input
            type="text"
            name="hospital_name"
            value={formData.hospital_name}
            onChange={handleChange}
            placeholder="병원"
            required
          />
        </div>
        <div className="input-group">
          <label>이벤트명</label>
          <input
            type="text"
            name="event_name"
            value={formData.event_name}
            onChange={handleChange}
            placeholder="이벤트명"
            required
          />
        </div>
        <div className="input-group">
          <label>매체</label>
          <input
            type="text"
            name="advertising_company"
            value={formData.advertising_company}
            onChange={handleChange}
            placeholder="매체"
            required
          />
        </div>
        {/* <div className="input-group url-code">
        <label>랜덤 코드</label>
        <input
          type="text"
          name="url_code"
          value={formData.url_code}
          placeholder="랜덤 코드"
          readOnly
        />
      </div> */}
        <button type="button" onClick={handleSubmit} disabled={!isFormValid}>
          코드 생성하기
        </button>
      </div>
      <style jsx>{`
        .code-generator {
          h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }
          .code_form {
            display: flex;
            justify-content: space-between;
            gap: 21px;
            .input-group {
              label {
                display: block;
                margin-bottom: 5px;
                color: #555;
              }
              input {
                width: 100%;
                padding: 10px;
                font-size: 16px;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
            }
            button {
              width: 240px;
              height: 50px;
              color: white;
              border-radius: 5px;
              background: #4880ff;
              cursor: pointer;
            }
            button[type="button"] {
              background-color: #555;
            }
            button:disabled {
              background-color: #999;
              cursor: not-allowed;
              border: none;
            }
            button:hover:enabled {
              background-color: #005bb5;
            }
             {
              /* .url-code {
              display: flex;
              align-items: center;
            }
            .url-code input {
              flex: 1;
              margin-right: 10px;
            } */
            }
          }
        }
      `}</style>
    </div>
  );
};

export default CodeGenerator;
