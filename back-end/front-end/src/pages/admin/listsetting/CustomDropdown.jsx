import React, { useState } from 'react';

function CustomDropdown({ status, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(status === 1 ? '진행 중' : '종료');

    console.log(status);
    const options = [
        { label: '진행 중', value: 1 },
        { label: '종료', value: 2 },
    ];

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
        onChange(option.value); // 값(1 또는 2)을 상위 컴포넌트에 전달
        setIsOpen(false); // 드롭다운 닫기
    };

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption || '진행/종료'}
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></span>
            </div>
            {isOpen && (
                <div className="dropdown-options">
                    {options.map((option) => (
                        <div
                            key={option.value}
                            className={`dropdown-option ${selectedOption === option.label ? 'selected' : ''}`}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
            <style jsx>{`
                .dropdown {
                    position: relative;
                    width: 140px;
                    font-family: Arial, sans-serif;

                    .dropdown-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 36px;
                        line-height: 36px;
                        padding: 0 10px 0 21px;
                        border: 1px solid #4880ff;
                        border-radius: 4px;
                        background-color: white;
                        cursor: pointer;
                    }

                    .dropdown-arrow {
                        border: solid black;
                        border-width: 0 1px 1px 0;
                        display: inline-block;
                        padding: 4px;
                        transform: rotate(45deg);
                        margin: 0px 7px 6px;
                    }

                    .dropdown-options {
                        position: absolute;
                        top: 105%;
                        left: 0;
                        width: 100%;
                        border: 1px solid #4880ff;
                        border-radius: 4px;
                        background-color: white;
                        max-height: 150px;
                        overflow-y: auto;
                        z-index: 100;
                    }

                    .dropdown-option {
                        height: 25px;
                        line-height: 25px;
                        padding: 0 10px;
                        cursor: pointer;
                        border-bottom: 1px solid #f1f1f1;
                        text-align: center;
                        color: #979797;
                        font-size: 12px;
                    }

                    .dropdown-option.selected {
                        background-color: #4880ff;
                        color: white;
                    }

                    .dropdown-option:last-child {
                        border-bottom: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default CustomDropdown;
