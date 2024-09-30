import React from 'react';

function AlertBox({ message, onCancel }) {
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel(); // 배경을 클릭하면 확인 이벤트 실행
        }
    };

    return (
        <div className="alert-box-overlay" onClick={handleBackgroundClick}>
            <div className="alert-box">
                <div className="alert-box-icon">
                    <span>!</span>
                </div>
                <p>{message}</p>
                <div className="alert-box-button" onClick={onCancel}>
                    <button>확인</button>
                </div>
            </div>
        </div>
    );
}

export default AlertBox;
