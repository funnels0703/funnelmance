import React from 'react';

function DeleteBox({ message, onCancel, onConfirm }) {
    // 모달 바깥 클릭시 닫히는 기능을 처리
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel(); // 배경을 클릭하면 취소
        }
    };

    return (
        <div className="delete-box-overlay" onClick={handleBackgroundClick}>
            <div className="delete-box">
                <div className="delete-box-icon">
                    <span>!</span>
                </div>
                <p>{message}</p>
                <div className="delete-box-buttons">
                    <button className="cancel-button" onClick={onCancel}>
                        취소
                    </button>
                    <button className="confirm-button" onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>

            {/* 스타일을 JSX 내부에 추가 */}
            <style jsx>{`
                .delete-box-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.6); /* 어두운 배경 */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 999; /* 다른 요소 위에 나타나도록 설정 */
                    .delete-box {
                        background-color: white;
                        width: 378px;
                        height: 192px;
                        border-radius: 10px;
                        text-align: center;
                    }

                    .delete-box-icon {
                        background-color: #ffe9e9;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 27px auto;
                        color: #ea0234;
                        text-align: center;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                    }

                    .delete-box p {
                        color: #202224;
                        text-align: center;
                        font-size: 16px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                        margin-bottom: 17px;
                    }

                    .delete-box-buttons {
                        display: flex;
                        justify-content: center;
                    }

                    .cancel-button,
                    .confirm-button {
                        width: 80px;
                        height: 30px;
                        border-radius: 5px;
                        border: none;
                        font-size: 14px;
                        cursor: pointer;
                        margin: 0 5px;
                    }

                    .cancel-button {
                        background-color: white;
                        border: 1px solid #ccc;
                        color: #979797;
                        text-align: center;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 500;
                        line-height: normal;
                    }

                    .confirm-button {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                        font-size: 14px;
                        background-color: #4880ff;
                        color: white;
                    }

                    .cancel-button:hover {
                        background-color: #f0f0f0;
                    }

                    .confirm-button:hover {
                        background-color: #3566cc;
                    }
                }
            `}</style>
        </div>
    );
}

export default DeleteBox;
