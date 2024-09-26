import { useState, useEffect } from 'react';
import axios from 'axios';
import TitleBox from '../../../components/TitleBox';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        username: '',
        password: '',
        name: '',
        role: '사원',
        isActive: true,
    });
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]); // 선택된 행 상태
    // 유저 데이터 가져오기
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/user/list');
                setUsers(response.data);
            } catch (error) {
                console.error('유저 데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchUsers();
    }, []);

    // 입력 필드 변경 핸들러 (새 유저)
    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
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
                        onChange={handleNewUserChange}
                        placeholder="아이디를 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleNewUserChange}
                        placeholder="비밀번호를 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleNewUserChange}
                        placeholder="이름을 입력하세요"
                    />
                </div>
                <div className="form-group">
                    <label>권한</label>
                    <select name="role" value={newUser.role} onChange={handleNewUserChange}>
                        <option value="2">광고 관리자</option>
                        <option value="3">콜 관리자</option>
                        <option value="4">콜 직원</option>
                        <option value="5">클라이언트</option>
                    </select>
                </div>
                {/* <div className="form-group">
          <label>상태</label>
          <select
            name="isActive"
            value={newUser.isActive.toString()}
            onChange={(e) =>
              setNewUser({ ...newUser, isActive: e.target.value === "true" })
            }
          >
            <option value="true">활성화</option>
            <option value="false">비활성화</option>
          </select>
        </div> */}
                <button onClick={handleRegister}>계정 등록하기</button>
            </div>

            {/* 유저 테이블 */}
            <h2>계정 리스트</h2>
            <button>삭제</button>
            <table className="user-table">
                <thead>
                    <tr>
                        <th style={{ width: '8%' }}>선택</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 4)' }}>아이디</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 4)' }}>비밀번호</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 4)' }}>이름</th>
                        <th style={{ width: 'calc((100% - 8% * 2) / 4)' }}>권한</th>
                        {/* <th>상태</th> */}
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
                                {editingUserId === user.user_id ? (
                                    <input
                                        type="password"
                                        value={user.password}
                                        onChange={(e) => handleUserChange(user.user_id, 'password', e.target.value)}
                                        className={editingUserId === user.user_id ? 'editing' : ''}
                                    />
                                ) : (
                                    user.password
                                )}
                            </td>
                            <td>
                                {editingUserId === user.user_id ? (
                                    <input
                                        type="text"
                                        value={user.name}
                                        onChange={(e) => handleUserChange(user.user_id, 'name', e.target.value)}
                                    />
                                ) : (
                                    user.name
                                )}
                            </td>

                            <td>
                                {editingUserId === user.user_id ? (
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleUserChange(user.user_id, 'role', e.target.value)}
                                    >
                                        <option value="PM">PM</option>
                                        <option value="콜팀">콜팀</option>
                                        <option value="사원">사원</option>
                                        <option value="팀장">팀장</option>
                                    </select>
                                ) : (
                                    user.role
                                )}
                            </td>
                            {/* <td>
                {editingUserId === user.user_id ? (
                  <select
                    value={user.is_active ? "true" : "false"}
                    onChange={(e) =>
                      handleUserChange(
                        user.user_id,
                        "is_active",
                        e.target.value === "true"
                      )
                    }
                  >
                    <option value="true">활성화</option>
                    <option value="false">비활성화</option>
                  </select>
                ) : user.is_active ? (
                  "활성화"
                ) : (
                  "비활성화"
                )}
              </td> */}
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

            <style jsx>{`
                .user_container {
                    .user-form {
                        margin-bottom: 50px;
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: center;
                        align-items: center;
                        gap: 20px 4%;
                        button {
                            width: 240px;
                            height: 50px;
                            font-size: 16px;
                            font-weight: 500;
                            border-radius: 5px;
                            background: #4880ff;
                            color: white;
                            border: none;
                        }

                        button:hover {
                            background-color: #3672d9;
                        }
                    }

                    .form-group {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: space-between;
                        width: 48%;
                    }
                    .form-group input[type='text'],
                    .form-group input[type='password'],
                    .form-group select {
                        width: 380px;
                        height: 50px;
                        font-size: 16px;
                        font-weight: 300;
                        color: #202224;
                        border-radius: 10px;
                        border: 1px solid #d9d9d9;
                        padding: 15px 20px;
                        &:focus {
                            border: 1px solid #4880ff;
                            outline: none;
                        }
                        &.editing {
                            border: 1px solid #979797;
                            background: rgba(208, 234, 255, 1);
                        }
                    }

                    > h2 {
                        color: #343434;
                        font-size: 20px;
                        font-weight: 700;
                        line-height: 50px;
                        float: left;
                        margin-bottom: 50px;
                    }
                    > button {
                        border-radius: 5px;
                        border: 1px solid #f00;
                        color: #ea0234;
                        font-size: 16px;
                        width: 101px;
                        height: 50px;
                        background-color: #fff;
                        float: right;
                    }
                    .user-table {
                        width: 100%;
                        border-collapse: collapse;
                        tr {
                            &.selected {
                                background: #d0eaff;
                            }
                        }
                        th {
                            background: #ededed;
                            color: #202224;
                            font-size: 14px;
                            font-weight: 500;
                            height: 48px;
                            text-align: left;
                        }
                        td {
                            border-bottom: 1px solid rgba(151, 151, 151, 0.6);
                            height: 65px;
                            font-size: 14px;
                        }
                        th:nth-of-type(1),
                        td:nth-of-type(1) {
                            text-align: center;
                        }
                        th:last-of-type,
                        td:last-of-type {
                        }
                    }

                    .user-table td input,
                    .user-table td select {
                        padding: 6px;
                        font-size: 14px;
                    }
                    .user-table td button {
                        width: 54px;
                        height: 27px;
                        border-radius: 5px;
                        color: #4880ff;
                        font-size: 12px;
                        font-weight: 700;
                        background: rgba(72, 128, 255, 0.2);
                        border: none;
                    }
                    .user-table td button:hover {
                        background-color: #005bb5;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserManagement;
