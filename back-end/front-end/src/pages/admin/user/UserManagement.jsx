import { useState, useEffect } from 'react';
import axios from 'axios';
import TitleBox from '../../../components/TitleBox';

import './user.scss';
import CustomDropdown from '../listsetting/CustomDropdown';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        name: '',
        role: 2,
        isActive: true,
        hospital_name_id: '',
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]); // 선택된 행 상태
    const itemsPerPage = 10; // 한 페이지에 표시할 항목 수

    //페이지네이션
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

    // 병원 리스트
    const [hospitals, setHospitals] = useState([]); // 병원 데이터를 저장할 state
    useEffect(() => {
        // 병원 데이터를 가져오는 함수
        const fetchHospitals = async () => {
            try {
                const response = await axios.get('/api/list/hospitals');

                const options = response.data.items.map((hospital) => ({
                    value: hospital.id,
                    label: hospital.name,
                }));

                // "All" 옵션을 병원 리스트의 맨 앞에 추가
                const allOption = { value: null, label: 'All' };
                setHospitals([allOption, ...options]); // 변환된 데이터를 state에 저장
            } catch (error) {
                console.error('병원 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchHospitals(); // 컴포넌트가 처음 렌더링될 때 데이터 요청
    }, []);
    // 유저 데이터 가져오기
    useEffect(() => {
        // 유저 데이터 가져오기
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/user/list?page=${currentPage}&limit=${itemsPerPage}`);
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages); // 서버에서 받은 전체 페이지 수
                setCurrentPage(response.data.currentPage); // 서버에서 받은 현재 페이지
            } catch (error) {
                console.error('데이터 로딩 오류:', error);
                alert('데이터를 불러오는데 실패했습니다.');
                setUsers([]);
            }
        };
        fetchUsers();
    }, [currentPage]);

    // ----------------------------------- 페이지 네이션
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page); // 페이지 변경
        }
    };

    // 입력 필드 변경 핸들러 (새 유저)
    const handleNewUserChange = (name, value) => {
        setNewUser({
            ...newUser,
            [name]: value,
        });
    };

    // 유저 등록 핸들러 (POST)
    const handleRegister = async () => {
        try {
            await axios.post('/api/user/register', newUser);
            alert('유저가 성공적으로 등록되었습니다!');
            // 유저 데이터 갱신
            const response = await axios.get('/api/user/list');
            setUsers(response.data);
            setNewUser({
                username: '',
                password: '',
                name: '',
                role: '사원',
                isActive: true,
            });
        } catch (error) {
            console.error('유저 등록 중 오류가 발생했습니다:', error);
            alert('유저 등록에 실패했습니다.');
        }
    };

    // 유저 수정 버튼 핸들러
    const handleEdit = (id) => {
        setEditingUserId(id);
    };

    // 유저 수정 저장 핸들러
    const handleSave = async (user) => {
        try {
            await axios.put(`/api/user/update`, user);
            alert('유저 정보가 성공적으로 수정되었습니다!');
            setEditingUserId(null); // 수정 모드 종료
        } catch (error) {
            console.error('유저 정보 수정 중 오류가 발생했습니다:', error);
            alert('유저 정보 수정에 실패했습니다.');
        }
    };

    // 개별 유저 필드 수정 핸들러
    const handleUserChange = (id, field, value) => {
        setUsers((prevUsers) => prevUsers.map((user) => (user.user_id === id ? { ...user, [field]: value } : user)));
    };

    // 체크박스 변경 핸들러
    const handleCheckboxChange = (id) => {
        setSelectedRows((prevSelectedRows) =>
            prevSelectedRows.includes(id) ? prevSelectedRows.filter((rowId) => rowId !== id) : [...prevSelectedRows, id]
        );
    };

    // 권한 옵션 데이터
    const roleOptions = [
        { label: '광고 관리자', value: 2 },
        { label: '콜 관리자', value: 3 },
        { label: '콜 직원', value: 4 },
        { label: '클라이언트', value: 5 },
    ];

    return (
        <div className="user_container container_left">
            <TitleBox mainmenu="관리자페이지" submenu="계정관리" />

            {/* 유저 등록 섹션 */}
            <div className="user-form">
                <div className="form-group">
                    <label>아이디</label>
                    <input
                        type="text"
                        name="username"
                        value={newUser.username}
                        onChange={(e) => handleNewUserChange('username', e.target.value)}
                        placeholder="아이디를 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={(e) => handleNewUserChange('password', e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={(e) => handleNewUserChange('name', e.target.value)}
                        placeholder="이름을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>권한</label>
                    <div style={{ width: '380px', height: '50px' }}>
                        <CustomDropdown
                            options={roleOptions}
                            selectedValue={newUser.role}
                            onChange={(value) => handleNewUserChange('role', value)}
                            bigDrop={1}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>관리병원</label>
                    <div style={{ width: '380px', height: '50px' }}>
                        <CustomDropdown
                            options={hospitals} // 병원 목록 get 해서 뿌려주기 value는 병원 id 값 label 은 병원 이름
                            selectedValue={hospitals.id}
                            onChange={(value) => handleNewUserChange('hospital_name_id', value)}
                            bigDrop={1}
                            search={1}
                        />
                    </div>
                </div>
                <div className="btnBox">
                    <button onClick={handleRegister}>계정 등록하기</button>
                </div>
            </div>

            {/* 유저 테이블 */}
            <h2>계정 리스트</h2>
            <button>삭제</button>
            <table className="user-table">
                <thead>
                    <tr>
                        <th style={{ width: '8%' }}>선택</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 5)' }}>아이디</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 5)' }}>비밀번호</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 5)' }}>이름</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 5)' }}>권한</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 5)' }}>관리 병원</th>
                        <th style={{ width: '8%' }}>수정</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id} className={selectedRows.includes(user.user_id) ? 'selected' : ''}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(user.user_id)}
                                    onChange={() => handleCheckboxChange(user.user_id)}
                                />
                            </td>
                            <td>{user.username}</td>
                            <td>
                                <input
                                    type="password"
                                    value={user.password}
                                    disabled={editingUserId !== user.user_id} // 수정 모드일 때만 활성화
                                    onChange={(e) => handleUserChange(user.user_id, 'password', e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    value={user.name}
                                    disabled={editingUserId !== user.user_id} // 수정 모드일 때만 활성화
                                    onChange={(e) => handleUserChange(user.user_id, 'name', e.target.value)}
                                />
                            </td>

                            <td>
                                {editingUserId === user.user_id ? (
                                    <div
                                        style={{
                                            width: '90%`',
                                            height: '36px',
                                            paddingRight: '15%',
                                        }}
                                    >
                                        <CustomDropdown
                                            options={roleOptions}
                                            selectedValue={user.role}
                                            onChange={(value) => handleUserChange(user.user_id, 'role', value)}
                                        />
                                    </div>
                                ) : (
                                    roleOptions.find((option) => option.value === user.role)?.label || '총 관리자'
                                )}
                            </td>
                            <td>
                                {editingUserId === user.user_id ? (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '36px',
                                            paddingRight: '15%',
                                        }}
                                    >
                                        <CustomDropdown
                                            options={hospitals} // 여기도 병원
                                            selectedValue={user.hospital_name_id} // 현재 유저의 병원 ID를 selectedValue로 전달
                                            onChange={(value) =>
                                                handleUserChange(user.user_id, 'hospital_name_id', value)
                                            }
                                        />
                                    </div>
                                ) : (
                                    hospitals.find((hospital) => hospital.value === user.hospital_name_id)?.label ||
                                    '병원 미지정'
                                )}
                            </td>
                            <td>
                                {editingUserId === user.user_id ? (
                                    <button onClick={() => handleSave(user)}>저장</button>
                                ) : (
                                    <button onClick={() => handleEdit(user.user_id)}>수정</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 페이지네이션 */}
            <div className="pagination">
                <button onClick={() => handlePageChange(1)}>
                    <img
                        src={process.env.PUBLIC_URL + '/images/page/start.png'}
                        className="doubleArrow"
                        alt="첫 페이지"
                    />
                </button>
                {/* 이전 페이지 */}
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <img
                        src={process.env.PUBLIC_URL + '/images/page/before.png'}
                        className="singleArrow"
                        alt="이전 페이지"
                    />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .slice((Math.ceil(currentPage / 10) - 1) * 10, Math.ceil(currentPage / 10) * 10)
                    .map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={page === currentPage ? 'currentPage' : ''}
                        >
                            {page}
                        </button>
                    ))}
                <button onClick={() => handlePageChange(currentPage + 10)}>{'...'}</button> {/* 다음 페이지 묶음 */}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <img
                        src={process.env.PUBLIC_URL + '/images/page/end.png'}
                        className="singleArrow"
                        alt="다음 페이지"
                    />
                </button>
                {/* 마지막 페이지 */}
                <button onClick={() => handlePageChange(totalPages)}>
                    <img
                        src={process.env.PUBLIC_URL + '/images/page/next.png'}
                        className="doubleArrow"
                        alt="마지막 페이지"
                    />
                </button>
            </div>
        </div>
    );
};

export default UserManagement;
