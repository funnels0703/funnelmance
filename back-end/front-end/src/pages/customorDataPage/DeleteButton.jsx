import React from 'react';

function DeleteButton({ handleUpdateStatus }) {
    return (
        <div>
            <button onClick={handleUpdateStatus} className="delete-button">
                {/* PUBLIC_URL을 사용하여 public 폴더 내의 이미지 파일 참조 */}
                <img src={process.env.PUBLIC_URL + '/images/trashcan.png'} alt="삭제" className="trashcan-icon" />
            </button>

            <style jsx>{`
                .delete-button {
                    position: fixed;
                    bottom: 34px;
                    right: 38px;
                    width: 80px;
                    height: 80px;
                    background-color: #ffffff; /* 배경색 흰색 */
                    border: none;
                    cursor: pointer;
                    z-index: 1000;
                    border-radius: 50%; /* 버튼을 원형으로 만들기 */
                    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
                }

                .trashcan-icon {
                    width: 27.5px;
                    height: 35px;
                }

                .delete-button:hover .trashcan-icon {
                    opacity: 0.8; /* 호버 시 이미지 약간 투명하게 변경 */
                }
            `}</style>
        </div>
    );
}

export default DeleteButton;
