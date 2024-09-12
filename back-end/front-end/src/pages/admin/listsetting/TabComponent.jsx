import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TabComponent() {
    const [activeTab, setActiveTab] = useState('hospitals');
    const [name, setName] = useState('');
    const [manager, setManager] = useState(''); // 담당자 이름 상태 추가
    const [data, setData] = useState([]);
    const [editableId, setEditableId] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        const urls = {
            hospitals: '/api/list/hospitals',
            events: '/api/list/events',
            advertising_companies: '/api/list/advertising_companies',
        };
        try {
            const response = await axios.get(urls[activeTab]);
            setData(response.data.map((item) => ({ ...item, edit: false })));
        } catch (error) {
            console.error('데이터 로딩 오류:', error);
            alert('데이터를 불러오는데 실패했습니다.');
            setData([]);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setName('');
        setManager('');
    };

    const handleAdd = async () => {
        const url = '/api/list/' + activeTab;
        const payload = activeTab === 'hospitals' ? { name, manager } : { name };
        try {
            const response = await axios.post(url, payload);
            console.log('데이터가 성공적으로 추가되었습니다:', response.data);
            alert('데이터가 성공적으로 추가되었습니다.');
            setData((prev) => [...prev, { ...response.data, id: prev.length + 1000, edit: false }]);
            setName('');
            setManager('');
        } catch (error) {
            console.error('데이터 추가 오류:', error);
            alert('데이터 추가에 실패했습니다.');
        }
    };

    const handleEdit = (id) => {
        setEditableId(id);
    };

    const handleUpdate = async (id) => {
        const item = data.find((item) => item.id === id);
        if (!item) return;
        const url = `/api/list/${activeTab}/${id}`;
        try {
            await axios.put(url, { name: item.name, status: item.status });
            alert('데이터가 성공적으로 업데이트되었습니다.');
            setEditableId(null);
        } catch (error) {
            console.error('데이터 업데이트 오류:', error);
            alert('데이터 업데이트에 실패했습니다.');
        }
    };

    return (
        <div className="listContainer">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'hospitals' ? 'active' : ''}`}
                    onClick={() => handleTabChange('hospitals')}
                >
                    병원 추가
                </button>
                <button
                    className={`tab ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => handleTabChange('events')}
                >
                    이벤트 추가
                </button>
                <button
                    className={`tab ${activeTab === 'advertising_companies' ? 'active' : ''}`}
                    onClick={() => handleTabChange('advertising_companies')}
                >
                    매체 추가
                </button>
            </div>
            <div className="form">
                <input type="text" placeholder="이름 입력" value={name} onChange={(e) => setName(e.target.value)} />
                {activeTab === 'hospitals' && (
                    <input
                        type="text"
                        placeholder="담당자 이름 입력"
                        value={manager}
                        onChange={(e) => setManager(e.target.value)}
                    />
                )}
                <button onClick={handleAdd}>추가</button>
            </div>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        {activeTab === 'hospitals' && <th>담당자</th>}
                        <th>상태</th>
                        <th>조치</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                        const newData = data.map((x) =>
                                            x.id === item.id ? { ...x, name: e.target.value } : x
                                        );
                                        setData(newData);
                                    }}
                                    disabled={editableId !== item.id}
                                />
                            </td>
                            {activeTab === 'hospitals' && (
                                <td>
                                    <input
                                        type="text"
                                        value={item.manager}
                                        onChange={(e) => {
                                            const newData = data.map((x) =>
                                                x.id === item.id ? { ...x, manager: e.target.value } : x
                                            );
                                            setData(newData);
                                        }}
                                        disabled={editableId !== item.id}
                                    />
                                </td>
                            )}
                            <td>
                                <select
                                    value={item.status}
                                    onChange={(e) => {
                                        const newData = data.map((x) =>
                                            x.id === item.id ? { ...x, status: e.target.value } : x
                                        );
                                        setData(newData);
                                    }}
                                    disabled={editableId !== item.id}
                                >
                                    <option value="활성화">활성화</option>
                                    <option value="비활성화">비활성화</option>
                                </select>
                            </td>
                            <td>
                                {editableId === item.id ? (
                                    <button onClick={() => handleUpdate(item.id)}>저장</button>
                                ) : (
                                    <button onClick={() => handleEdit(item.id)}>수정</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                .listContainer {
                    max-width: 900px;
                    margin: 40px auto;
                    padding: 20px;
                    border-radius: 16px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    background-color: #ffffff;
                    text-align: center;
                    font-family: 'Roboto', sans-serif;
                    transition: all 0.3s ease-in-out;
                }
                .tabs {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 20px;
                    border-bottom: 2px solid #e0e0e0;
                }
                .tab {
                    flex-grow: 1;
                    padding: 14px;
                    cursor: pointer;
                    background-color: #f9f9f9;
                    color: #333;
                    font-size: 16px;
                    font-weight: 500;
                    border-radius: 8px 8px 0 0;
                    transition: background-color 0.3s, color 0.3s;
                }
                .tab.active {
                    background-color: #007bff;
                    color: white;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .tab:not(.active):hover {
                    background-color: #e0e0e0;
                }
                .form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 20px;
                }
                input {
                    width: 100%;
                    max-width: 500px;
                    padding: 12px;
                    margin-bottom: 20px;
                    border: 2px solid #ddd;
                    border-radius: 8px;
                    font-size: 15px;
                    transition: border-color 0.3s;
                }
                input:focus {
                    border-color: #007bff;
                }
                button {
                    width: 80%;
                    max-width: 300px;
                    padding: 12px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .data-table th,
                .data-table td {
                    border: 1px solid #ddd;
                    padding: 12px;
                    text-align: left;
                    font-size: 14px;
                }
                .data-table th {
                    background-color: #f1f1f1;
                    font-weight: 600;
                }
                .data-table td {
                    background-color: #fafafa;
                    transition: background-color 0.3s;
                }
                .data-table td:hover {
                    background-color: #f5f5f5;
                }
                @media (max-width: 768px) {
                    .tabs {
                        flex-direction: column;
                    }
                    .tab {
                        margin-bottom: 10px;
                    }
                    .form {
                        width: 100%;
                        padding: 0 20px;
                    }
                    button {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default TabComponent;
