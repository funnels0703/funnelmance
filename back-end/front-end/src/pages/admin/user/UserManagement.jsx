import { useState, useEffect } from 'react';
import axios from 'axios';

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

    return (
        <div className="container">
            <h1>직원 관리 시스템</h1>

            {/* 유저 등록 섹션 */}
            <div className="user-form">
                <h2>유저 등록</h2>
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
                        <option value="PM">PM</option>
                        <option value="콜팀">콜팀</option>
                        <option value="사원">사원</option>
                        <option value="팀장">팀장</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>상태</label>
                    <select
                        name="isActive"
                        value={newUser.isActive.toString()}
                        onChange={(e) => setNewUser({ ...newUser, isActive: e.target.value === 'true' })}
                    >
                        <option value="true">활성화</option>
                        <option value="false">비활성화</option>
                    </select>
                </div>
                <button onClick={handleRegister}>직원 등록</button>
            </div>

            {/* 유저 테이블 */}
            <table className="user-table">
                <thead>
                    <tr>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>권한</th>
                        <th>상태</th>
                        <th>수정</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>{user.username}</td>
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
                            <td>
                                {editingUserId === user.user_id ? (
                                    <select
                                        value={user.is_active ? 'true' : 'false'}
                                        onChange={(e) =>
                                            handleUserChange(user.user_id, 'is_active', e.target.value === 'true')
                                        }
                                    >
                                        <option value="true">활성화</option>
                                        <option value="false">비활성화</option>
                                    </select>
                                ) : user.is_active ? (
                                    '활성화'
                                ) : (
                                    '비활성화'
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

            <style jsx>{`
                .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 30px;
                    background-color: #f4f6f8;
                    border-radius: 12px;
                    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
                }
                h1,
                h2 {
                    text-align: center;
                    color: #333;
                    font-weight: 700;
                    margin-bottom: 20px;
                }
                .user-form {
                    margin-bottom: 40px;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .form-group {
                    margin-bottom: 15px;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: bold;
                    color: #555;
                }
                .form-group input[type='text'],
                .form-group input[type='password'],
                .form-group select {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ccd0d5;
                    border-radius: 6px;
                    font-size: 16px;
                    background-color: #f9f9f9;
                    color: #333;
                }
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #28a745;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                button:hover {
                    background-color: #218838;
                }
                .user-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .user-table th,
                .user-table td {
                    padding: 12px;
                    border: 1px solid #ddd;
                    text-align: center;
                }
                .user-table th {
                    background-color: #0070f3;
                    color: white;
                }
                .user-table td input,
                .user-table td select {
                    padding: 6px;
                    font-size: 14px;
                }
                .user-table td button {
                    padding: 8px 12px;
                    background-color: #0070f3;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .user-table td button:hover {
                    background-color: #005bb5;
                }
            `}</style>
        </div>
    );
};

export default UserManagement;
