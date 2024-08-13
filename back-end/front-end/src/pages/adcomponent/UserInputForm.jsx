// UserInputForm.js
import React, { useState } from 'react';

const UserInputForm = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({ name, phone });
    };

    return (
        <form onSubmit={handleSubmit} className="formContainer">
            <div>
                <label htmlFor="name">이름:</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="phone">전화번호:</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <button type="submit">제출</button>
            <style jsx>{`
                .formContainer {
                    max-width: 400px;
                    margin: 20px auto;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                }
                input {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }
            `}</style>
        </form>
    );
};

export default UserInputForm;
