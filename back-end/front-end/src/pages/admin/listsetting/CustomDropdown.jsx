import React, { useState, useEffect } from "react";

function CustomDropdown({ selectedValue, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  // selectedValue와 options를 기반으로 selectedOption 초기화
  useEffect(() => {
    // selectedValue와 일치하는 옵션을 찾아서 설정
    const currentOption = options.find(
      (option) => option.label === selectedValue
    );
    if (currentOption) {
      setSelectedOption(currentOption.label);
    }
  }, [selectedValue, options]);

  const handleOptionClick = (option) => {
    setSelectedOption(option.label);
    onChange(option.value); // 선택된 값을 상위 컴포넌트로 전달
    setIsOpen(false); // 드롭다운 닫기
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        {selectedOption || "선택"}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </div>
      {isOpen && (
        <div className="dropdown-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`dropdown-option ${
                option.label === selectedOption ? "selected" : ""
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
