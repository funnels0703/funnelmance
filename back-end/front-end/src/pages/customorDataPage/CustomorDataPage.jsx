import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FilterComponent from './FilterComponent';

function CustomorDataPage({ title, get_status, put_status }) {
    const [customors, setCustomors] = useState([]);
    const [editState, setEditState] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const limit = 10; // 한 페이지에 보여줄 데이터 수
    const [recentSettings, setRecentSettings] = useState([]);

    // filters 상태를 CustomorDataPage에서 관리
    const [filters, setFilters] = useState({
        dividend_status: '',
        hospital_name: '',
        event_name: '',
        advertising_company: '',
        ad_title: '',
        url_code: '',
        name: '',
        phone: '',
        date: '',
    });
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };
    useEffect(() => {
        fetchData(filters); // currentPage가 변경될 때마다 데이터 가져오기
    }, [currentPage]);

    const fetchData = async (filters = {}) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/customor/search', {
                data_status: get_status,
                page: currentPage,
                limit,
                ...filters,
            });

            if (response.data.total > 0) {
                setCustomors(
                    response.data.data.map((customor) => ({
                        ...customor,
                        isSelected: false,
                    }))
                );
                setTotalPages(Math.ceil(response.data.total / limit));
                const initialState = {};
                response.data.data.forEach((item) => {
                    initialState[item.id] = false;
                });
                setRecentSettings(response.data.recentSettings);
                setEditState(initialState);
            } else {
                // total이 0일 경우
                setCustomors([]); // 빈 배열로 설정
                setTotalPages(1); // 페이지를 1로 설정
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
            setLoading(false);
        }
    };

    // 매체 필터링 버튼 클릭 핸들러
    const handleMediaFilter = (company) => {
        const updatedFilters = { ...filters, advertising_company: company };
        setFilters(updatedFilters);
        fetchData(updatedFilters);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };
    const handleApplyFilters = () => {
        fetchData(filters);
    };

    const handleCheckboxChange = (index) => {
        setCustomors((prevCustomors) =>
            prevCustomors.map((customor, i) =>
                i === index ? { ...customor, isSelected: !customor.isSelected } : customor
            )
        );
    };

    const handleEdit = (id) => {
        setEditState((prev) => ({ ...prev, [id]: true }));
    };

    const handleInputChange = (index, field, value) => {
        setCustomors((prevCustomors) =>
            prevCustomors.map((customor, i) => (i === index ? { ...customor, [field]: value } : customor))
        );
    };

    const handleSubmit = async (index) => {
        const customor = customors[index];
        try {
            const response = await axios.put(`/api/customor/${customor.id}`, customor);
            console.log('Data updated successfully:', response.data);
            setEditState((prev) => ({ ...prev, [customor.id]: false }));
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const handlePermanentDelete = async () => {
        const selectedIds = customors.filter((customor) => customor.isSelected).map((customor) => customor.id);
        if (selectedIds.length > 0) {
            try {
                const response = await axios.delete(`/api/customor/delete`, {
                    data: { ids: selectedIds },
                });
                console.log('Permanent delete successful:', response.data);
                alert('선택한 데이터가 영구적으로 삭제되었습니다.');
                await fetchData();
            } catch (error) {
                console.error('Error during permanent deletion:', error);
                alert('영구 삭제 중 오류가 발생했습니다.');
            }
        } else {
            alert('삭제할 데이터를 선택하세요.');
        }
    };

    const handleUpdateStatus = async () => {
        const selectedIds = customors.filter((customor) => customor.isSelected).map((customor) => customor.id);
        if (selectedIds.length > 0) {
            try {
                const response = await axios.put(`/api/customor/update-status`, {
                    ids: selectedIds,
                    data_status: put_status,
                });
                console.log('Status updated successfully:', response.data);
                alert('선택한 데이터가 삭제되었습니다.');
                await fetchData();
            } catch (error) {
                console.error('Error updating status:', error);
                alert('선택한 데이터가 삭제 중 오류가 발생했습니다.');
            }
        } else {
            alert('삭제할 데이터를 선택하세요.');
        }
    };

    return (
        <div className="container">
            <h2>{title}</h2>

            {/* filters 상태와 handleFilterChange 함수를 FilterComponent에 전달 */}
            <FilterComponent
                filters={filters}
                onFilterChange={handleFilterChange}
                handleApplyFilters={handleApplyFilters}
            />
            {/* 매체 필터 버튼들 */}
            <div className="media-buttons">
                <button onClick={() => handleMediaFilter('토스')}>토스</button>
                <button onClick={() => handleMediaFilter('당근')}>당근</button>
                <button onClick={() => handleMediaFilter('카카오')}>카카오</button>
            </div>
            {/* 건 수 나오는 곳  */}
            <div className="recent-settings">
                <h3>최근 설정</h3>
                <div className="card-container">
                    {recentSettings &&
                        recentSettings.map((setting) => (
                            <div className="card" key={setting.id}>
                                <div className="card-title">{setting.ad_title}</div>
                                <div className="card-count">{setting.count}건</div>
                            </div>
                        ))}
                </div>
            </div>
            {/* 삭제 버튼  */}
            <button onClick={handleUpdateStatus} className="delete-button">
                {get_status === 1 ? '복원' : '삭제'}
            </button>
            {get_status === 1 && (
                <button onClick={() => handlePermanentDelete()} className="permanent-delete">
                    영구삭제
                </button>
            )}
            <table className="customor-table">
                <thead>
                    <tr>
                        <th>선택</th>
                        <th>No</th>
                        <th>배당 여부</th>
                        <th>병원명</th>
                        <th>이벤트명</th>
                        <th>매체</th>
                        <th>광고 제목</th>
                        <th>코드</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>일자</th>
                        <th>수정</th>
                    </tr>
                </thead>
                {/* 데이터 뿌려주는 부분 */}
                <tbody>
                    {totalPages === 0 ? (
                        <tr>
                            <td colSpan="11" style={{ textAlign: 'center', padding: '20px' }}>
                                아직 데이터가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        customors.map((customor, index) => (
                            <tr key={customor.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={customor.isSelected}
                                        onChange={() => handleCheckboxChange(index)}
                                    />
                                </td>
                                <td>{customor.id}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.dividend_status}
                                        onChange={(e) => handleInputChange(index, 'dividend_status', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.url_code_setting?.hospital_name}
                                        onChange={(e) =>
                                            handleInputChange(index, 'url_code_setting.hospital_name', e.target.value)
                                        }
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.url_code_setting?.event_name}
                                        onChange={(e) =>
                                            handleInputChange(index, 'url_code_setting.event_name', e.target.value)
                                        }
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.url_code_setting?.advertising_company}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                'url_code_setting.advertising_company',
                                                e.target.value
                                            )
                                        }
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.url_code_setting?.ad_title}
                                        onChange={(e) =>
                                            handleInputChange(index, 'url_code_setting.ad_title', e.target.value)
                                        }
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.url_code}
                                        onChange={(e) => handleInputChange(index, 'url_code', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.name}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.phone}
                                        onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={customor.created_at ? customor.created_at.split('T')[0] : ''}
                                        onChange={(e) => handleInputChange(index, 'created_at', e.target.value)}
                                        disabled={!editState[customor.id]}
                                    />
                                </td>
                                <td>
                                    {editState[customor.id] ? (
                                        <button className="submit-button" onClick={() => handleSubmit(index)}>
                                            저장하기
                                        </button>
                                    ) : (
                                        <button className="edit-button" onClick={() => handleEdit(customor.id)}>
                                            수정하기
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    이전
                </button>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    다음
                </button>
            </div>
            <style jsx>{`
        /* 기존 스타일 그대로 유지 */
        .container {
          padding: 20px;
          max-width: 100%;
          overflow-x: auto;
        }

        h2 {
          margin-bottom: 20px;
          text-align: center;
        }

        .delete-button {
          margin-bottom: 10px;
          padding: 10px 15px;
          background-color: #dc3545;
          color: white;
          border: none;
          cursor: pointer;
        }
        
        .delete-button:hover {
          background-color: #c82333;
        }

        .customor-table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align left;
        }

        th {
          background-color: #eee;
        }

        .submit-button, .edit-button {
          padding: 5px 10px;
          background-color: #007bff;
          color: white;
          border: none;
          cursor: pointer;
        }

        .submit-button:hover, .edit-button:hover {
          background-color: #0056b3;
        }
        input {
          width: 100%;
          padding: 5px;
          box-sizing: border-box;
        }

        input:disabled {
          background-color: #f5f5f5;
          border: 1px solid #ddd;
        }
        .pagination {
          display: flex;  
          justify-content: center;
            margin: 20px 0;
        }
        .pagination button {
          margin: 0 5px;
          padding: 5px 10px;
        }
        {/* 버튼  */}
        .media-buttons {
          margin-bottom: 20px;
          text-align: center;
        }

        .media-buttons button {
          margin: 0 10px;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .media-buttons button:hover {
          background-color: #0056b3;
        }
        {/* 카드쪽  */}
        .recent-settings {
          margin-bottom: 20px;
          text-align: center;
        }
        .card-container {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .card {
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: calc(20% - 20px); /* 20% 너비에서 간격을 고려 */
          box-sizing: border-box;
          transition: transform 0.3s ease;
          text-align: center;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .card-count {
          font-size: 1rem;
          color: #007bff;
        }
      `}</style>
        </div>
    );
}

export default CustomorDataPage;
