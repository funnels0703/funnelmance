import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function CodePage() {
    const { urlCode } = useParams();
    const [codeData, setCodeData] = useState(null);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchCodeData = async () => {
            try {
                const hasClicked = localStorage.getItem(`clicked_${urlCode}`);

                if (!hasClicked) {
                    const response = await axios.get(`/api/urlcode/${urlCode}`);
                    setCodeData(response.data);
                    localStorage.setItem(`clicked_${urlCode}`, 'true');
                } else {
                    const response = await axios.get(`/api/urlcode/${urlCode}`);
                    setCodeData(response.data);
                }
            } catch (err) {
                setError('잘못된 경로입니다.');
            }
        };

        fetchCodeData();
    }, [urlCode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        // try {
        //     await axios.post(`/api/submit`, { ...formData, urlCode });
        //     alert('제출이 완료되었습니다.');
        //     setFormData({
        //         name: '',
        //         email: '',
        //         phone: '',
        //     });
        // } catch (err) {
        //     console.error('Error submitting form:', err);
        //     alert('제출에 실패했습니다. 다시 시도해주세요.');
        // }
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
            <h2>랜딩 페이지</h2>
            <p>아래 정보를 입력해 주세요.</p>
            <div className="input-group">
                <label>이름:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
                <label>이메일:</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="input-group">
                <label>전화번호:</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <button className="submit-button" onClick={handleSubmit}>
                제출하기
            </button>

            <style jsx>{`
                .container {
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

export default CodePage;
