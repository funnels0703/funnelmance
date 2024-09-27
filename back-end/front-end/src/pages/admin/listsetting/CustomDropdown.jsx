import React, { useState } from "react";

function CustomDropdown({ status, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    status === 1 ? "진행 중" : "종료"
  );

  console.log(status);
  const options = [
    { label: "진행 중", value: 1 },
    { label: "종료", value: 2 },
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    onChange(option.value); // 값(1 또는 2)을 상위 컴포넌트에 전달
    setIsOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption || "진행/종료"}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-option ${
                selectedOption === option.label ? "selected" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomDropdown;
