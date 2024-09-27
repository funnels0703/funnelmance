import React from "react";

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
    </div>
  );
}

export default DeleteBox;
