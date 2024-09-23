import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleBox from '../../../components/TitleBox';
import CustomDropdown from './CustomDropdown';

function TabComponent() {
    const [activeTab, setActiveTab] = useState('hospitals');
    const [name, setName] = useState('');
    const [hospital_code, setHospital_code] = useState('');
    const [data, setData] = useState([]);
    const [editableId, setEditableId] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]); // 선택된 항목을 저장하는 상태 추가

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        const urls = {
            hospitals: '/api/list/hospitals',
            events: '/api/list/events',
            advertising_company: '/api/list/advertising_companies',
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
        setHospital_code('');
    };

    const handleAdd = async () => {
        const url = '/api/list/' + activeTab;
        const payload = activeTab === 'hospitals' ? { name, hospital_code } : { name };
        try {
            const response = await axios.post(url, payload);
            console.log('데이터가 성공적으로 추가되었습니다:', response.data);
            alert('데이터가 성공적으로 추가되었습니다.');
            setData((prev) => [...prev, { ...response.data, id: prev.length + 1000, edit: false }]);
            setName('');
            setHospital_code('');
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

        // 병원 코드와 담당자 정보를 포함하여 PUT 요청을 보냄
        const payload = {
            name: item.name,
            status: item.status,
            hospital_code: item.hospital_code, // 병원 코드 추가
            manager: item.manager, // 담당자 추가
        };

        try {
            await axios.put(url, payload);
            alert('데이터가 성공적으로 업데이트되었습니다.');
            setEditableId(null);
        } catch (error) {
            console.error('데이터 업데이트 오류:', error);
            alert('데이터 업데이트에 실패했습니다.');
        }
    };

    // 선택 처리 핸들러
    const handleSelect = (id) => {
        setSelectedIds(
            (prevSelected) =>
                prevSelected.includes(id)
                    ? prevSelected.filter((selectedId) => selectedId !== id) // 이미 선택된 경우 제거
                    : [...prevSelected, id] // 선택되지 않은 경우 추가
        );
    };

    return (
        <div className="listContainer container_flex">
            <div className="TabSetting container_left">
                <TitleBox
                    mainmenu="관리자페이지"
                    submenu={
                        activeTab === 'hospitals'
                            ? '병원 등록'
                            : activeTab === 'events'
                            ? '이벤트 등록'
                            : activeTab === 'advertising_company'
                            ? '매체 등록'
                            : ''
                    }
                />
                <div className="postForm">
                    <label>
                        {activeTab === 'hospitals' && '병원 이름'}
                        {activeTab === 'events' && '이벤트 이름'}
                        {activeTab === 'advertising_company' && '매체 이름'}
                        <input
                            className={`listInput ${
                                activeTab === 'events'
                                    ? 'longInput'
                                    : activeTab === 'advertising_company'
                                    ? 'longInput2'
                                    : ''
                            }`}
                            type="text"
                            placeholder={
                                activeTab === 'hospitals'
                                    ? '병원 이름을 입력하세요.'
                                    : activeTab === 'events'
                                    ? '이벤트 이름을 입력하세요.'
                                    : '매체 이름을 입력하세요.'
                            }
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                    {activeTab === 'hospitals' && (
                        <label>
                            병원 코드
                            <input
                                className="listInput"
                                type="text"
                                placeholder="할당 번호를 입력하세요"
                                value={hospital_code}
                                onChange={(e) => setHospital_code(e.target.value)}
                            />
                        </label>
                    )}
                </div>
                {/* post 버튼  */}
                <button className="listPostBtn" onClick={handleAdd}>
                    {activeTab === 'hospitals'
                        ? '병원 등록하기'
                        : activeTab === 'events'
                        ? '이벤트 등록하기'
                        : '매체 등록하기'}
                </button>
                <div className="listTitleHeader">
                    <h2 className="listTitle">
                        {activeTab === 'hospitals'
                            ? '병원'
                            : activeTab === 'events'
                            ? '이벤트'
                            : activeTab === 'advertising_company'
                            ? '매체'
                            : ''}{' '}
                        리스트
                    </h2>
                    <button className="listDeleteBTN">삭제</button>
                </div>

                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center', width: '8%' }}>선택</th>
                            {activeTab === 'hospitals' && <th style={{ width: '12%' }}>병원코드</th>}
                            <th style={{ width: '20%' }}>병원이름</th>
                            <th style={{ paddingLeft: '20px', width: '18%' }}>진행/종료</th>
                            {activeTab === 'hospitals' && <th style={{ width: '20%' }}>담당자</th>}
                            <th style={{ width: '8%' }}>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className={selectedIds.includes(item.id) ? 'selected' : ''} // 선택된 항목에 클래스 추가
                                onClick={() => handleSelect(item.id)} // 선택 처리
                            >
                                <td style={{ textAlign: 'center' }}>
                                    <input type="checkbox" checked={selectedIds.includes(item.id)} readOnly />
                                </td>
                                {activeTab === 'hospitals' && (
                                    <td className={`${item.status === '종료' ? 'editInputColor' : ''}`}>
                                        <input
                                            type="text"
                                            value={item.hospital_code || ''}
                                            onChange={(e) => {
                                                const newData = data.map((x) =>
                                                    x.id === item.id ? { ...x, hospital_code: e.target.value } : x
                                                );
                                                setData(newData); // 상태를 업데이트하여 value가 변하도록 설정
                                            }}
                                            disabled={editableId !== item.id}
                                            className={`${editableId === item.id ? 'editInputColor' : ''}`}
                                        />
                                    </td>
                                )}

                                <td className={`${item.status === '종료' ? 'editInputColor' : ''}`}>{item.name}</td>
                                <td className={`${item.status === '종료' ? 'editInputColor' : ''}`}>
                                    {editableId === item.id ? (
                                        <CustomDropdown
                                            status={item.status}
                                            onChange={(newStatus) => {
                                                const newData = data.map((x) =>
                                                    x.id === item.id ? { ...x, status: newStatus } : x
                                                );
                                                setData(newData);
                                            }}
                                        />
                                    ) : (
                                        <span className="normalSpan">{item.status}</span>
                                    )}
                                </td>

                                {activeTab === 'hospitals' && (
                                    <td className={`${item.status === '종료' ? 'editInputColor' : ''}`}>
                                        <input
                                            type="text"
                                            value={item.manager || ''}
                                            onChange={(e) => {
                                                const newData = data.map((x) =>
                                                    x.id === item.id ? { ...x, manager: e.target.value } : x
                                                );
                                                setData(newData);
                                            }}
                                            disabled={editableId !== item.id} // 담당자 필드는 수정 가능
                                            className={`${editableId === item.id ? 'editInputColor' : ''}`}
                                        />
                                    </td>
                                )}
                                <td className={`${item.status === '종료' ? 'editInputColor' : ''}`}>
                                    {editableId === item.id ? (
                                        <button className="listSaveBTN" onClick={() => handleUpdate(item.id)}>
                                            저장
                                        </button>
                                    ) : (
                                        <button
                                            className={`${
                                                item.status === '종료' ? 'listSaveBTN editInputColor' : 'listSaveBTN'
                                            }`}
                                            onClick={() => handleEdit(item.id)}
                                        >
                                            수정
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'hospitals' ? 'active' : ''}`}
                    onClick={() => handleTabChange('hospitals')}
                >
                    병원 등록
                </button>
                <button
                    className={`tab ${activeTab === 'events' ? 'active' : ''}`}
                    onClick={() => handleTabChange('events')}
                >
                    이벤트 등록
                </button>
                <button
                    className={`tab ${activeTab === 'advertising_company' ? 'active' : ''}`}
                    onClick={() => handleTabChange('advertising_company')}
                >
                    매체 등록
                </button>
            </div>
            <style jsx>{`
                .listContainer {
                    background-color: #f5f6fa;
                }
                .TabSetting {
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                }
                .tabs {
                    display: flex;
                    flex-direction: column;
                    height: 204px;
                }

                .tab {
                    width: 20.8vw;
                    height: 60px;
                    flex-grow: 1;
                    margin-bottom: 12px;
                    cursor: pointer;
                    color: white;
                    background-color: #ffffff;
                    color: #003181;
                    font-size: 16px;
                    font-weight: 500;
                    border: 1px solid #003181;
                    border-radius: 8px;
                }

                .tab.active {
                    background-color: #003181;
                    color: #ffffff;
                }
                .listPostBtn {
                    width: 240px;
                    height: 50px;
                    margin: 0 auto;
                    align-items: center;
                    background-color: #4880ff;
                    color: white;
                    text-align: center;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    border: none;
                    border-radius: 5px;
                    margin-top: 25px;
                }

                .listTitleHeader {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    width: 100%;
                    margin-bottom: 50px;
                }
                .listTitle {
                    color: #343434;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 50px;
                }
                .listDeleteBTN {
                    border-radius: 5px;
                    border: 1px solid #f00;
                    color: #ea0234;
                    font-size: 16px;
                    width: 101px;
                    height: 50px;
                    background-color: #fff;
                }
                .postForm {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    width: 940px;
                    justify-content: space-between;
                    label {
                        color: #343434;
                        font-size: 16px;
                        font-weight: 500;
                        height: 50px;
                        line-height: 50px;
                    }
                }
                .listInput {
                    margin-left: 14px;
                    width: 19.791vw;
                    height: 50px;
                    border-radius: 10px;
                    border: 1px solid #d9d9d9;
                    background: var(--White, #fff);
                    outline: none;
                    padding: 0 21px;
                    font-size: 16px;
                    line-height: 50px;
                    text-align: left;
                }
                .longInput {
                    width: 44.41vw;
                }
                .longInput2 {
                    width: 45.13vw;
                }

                 {
                    /* ------------------------------------------------- */
                }
                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .data-table th,
                .data-table td {
                    text-align: left;
                    font-size: 14px;
                }
                .data-table th {
                    background-color: #ededed;
                    font-weight: 600;
                    text-align: left;
                    padding: 16px 0 15px;
                }

                .data-table input[type='checkbox'] {
                    width: 17px;
                    height: 17px;
                }
                .data-table input[type='text'] {
                    width: 72px;
                    height: 36px;
                    padding: 9px;
                    margin: 14px 2px;
                    background-color: #d0eaff;
                    border: 1px solid #979797;
                    outline: none;
                    text-align: center;
                    color: rgba(32, 34, 36, 0.3);
                    border-radius: 2px;
                }

                .editInputColor input,
                .editInputColor button {
                    background-color: #f8f4f4; /* input이나 button의 백그라운드 색상 */
                }
                .listSaveBTN {
                    width: 54px;
                    height: 27px;
                    line-height: 27px;
                    text-align: center;
                    border-radius: 3px;
                    background-color: rgba(72, 128, 255, 0.2);
                    color: #4880ff;
                    text-align: center;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 700;
                    line-height: normal;
                    border: none;
                }
                .editInputColor {
                    color: #cfcfcf;
                }
                .normalSpan {
                    padding: 0 0 0 21px;
                }
                .selected {
                    background-color: #d0eaff;
                }
                @media (max-width: 768px) {
                    .tabs {
                        flex-direction: column;
                    }
                    .tab {
                        margin-bottom: 10px;
                    }
                    .postForm {
                        width: 100%;
                        padding: 0 20px;
                    }
                }
            `}</style>
        </div>
    );
}

export default TabComponent;
