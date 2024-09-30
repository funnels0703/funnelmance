import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleBox from '../../components/TitleBox';
import CustomDropdown from '../admin/listsetting/CustomDropdown';

const CodeGenerator = () => {
    const [formData, setFormData] = useState({
        ad_title: '',
        ad_number: '',
        hospital_name: '',
        event_name: '',
        advertising_company: '',
        url_code: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);

    const [hospitals, setHospitals] = useState([]); // 병원 목록 상태
    const [events, setEvents] = useState([]); // 이벤트 목록 상태
    const [companies, setCompanies] = useState([]); // 매체 목록 상태

    // 병원, 이벤트, 매체 목록 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hospitalRes, eventRes, companyRes] = await Promise.all([
                    axios.get('/api/list/hospitals'),
                    axios.get('/api/list/events'),
                    axios.get('/api/list/advertising_companies'),
                ]);

                // API로 받은 데이터를 드롭다운의 options 형식으로 변환
                const hospitalOptions = hospitalRes.data.items.map((hospital) => ({
                    value: hospital.id,
                    label: hospital.name,
                }));
                const eventOptions = eventRes.data.items.map((event) => ({
                    value: event.id,
                    label: event.name,
                }));
                const companyOptions = companyRes.data.items.map((company) => ({
                    value: company.id,
                    label: company.name,
                }));

                // 상태 업데이트
                setHospitals(hospitalOptions);
                setEvents(eventOptions);
                setCompanies(companyOptions);
            } catch (error) {
                console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, []);

    // Input change handler
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDropdownChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Validate form
    useEffect(() => {
        const isValid = Object.values(formData).every((value) => value.trim() !== '');
        setIsFormValid(isValid);
    }, [formData]);

    // Data submit handler
    const handleSubmit = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const dataToSubmit = { ...formData, url_code: result };

        try {
            const response = await axios.post('/api/urlcode', dataToSubmit);
            alert('코드 생성했습니다');
        } catch (error) {
            console.error('Error posting data:', error);
            if (error.response && error.response.status === 400) {
                alert('중복된 코드입니다. 다시 생성해 주세요.');
            } else {
                alert('데이터 전송 중 오류가 발생했습니다.');
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
                    <div style={{ width: '217px', height: '40px' }}>
                        <CustomDropdown
                            options={hospitals} // 병원 목록 전달
                            selectedValue={formData.hospital_name}
                            onChange={(value) => handleDropdownChange('hospital_name', value)} // 선택된 값 업데이트
                            bigDrop={1}
                            search={1}
                        />{' '}
                    </div>
                </div>
                <div className="input-group">
                    <label>이벤트명</label>
                    <div style={{ width: '217px', height: '40px' }}>
                        <CustomDropdown
                            options={events} // 이벤트 목록 전달
                            selectedValue={formData.event_name}
                            onChange={(value) => handleDropdownChange('event_name', value)} // 선택된 값 업데이트
                            bigDrop={1}
                            search={1}
                        />{' '}
                    </div>
                </div>
                <div className="input-group">
                    <label>매체</label>
                    <div style={{ width: '217px', height: '40px' }}>
                        <CustomDropdown
                            options={companies} // 매체 목록 전달
                            selectedValue={formData.advertising_company}
                            onChange={(value) => handleDropdownChange('advertising_company', value)} // 선택된 값 업데이트
                            bigDrop={1}
                            search={1}
                        />
                    </div>
                </div>
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
                        button[type='button'] {
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
