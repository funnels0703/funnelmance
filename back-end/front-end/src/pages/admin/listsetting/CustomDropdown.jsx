import React, { useState, useEffect } from 'react';

function CustomDropdown({ selectedValue, options, onChange, bigDrop, search }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // 검색어를 위한 상태

    console.log(selectedValue, options);
    // selectedValue와 options를 기반으로 selectedOption 초기화
    useEffect(() => {
        const currentOption = options.find((option) => option.value === selectedValue);
        if (currentOption) {
            setSelectedOption(currentOption.label);
        }
    }, [selectedValue, options]);

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
        onChange(option.value); // 선택된 값을 상위 컴포넌트로 전달
        setIsOpen(false); // 드롭다운 닫기
    };

    // 검색어를 기반으로 옵션 필터링
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="dropdown">
            <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
                {selectedOption || '선택'}
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}></span>
            </div>

            {isOpen && (
                <div className="dropdown-options">
                    {search === 1 && (
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
                            placeholder="검색"
                            className="dropdown-search"
                        />
                    )}

                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`${bigDrop === 1 ? 'dropdown-option-set' : 'dropdown-option'} ${
                                    option.label === selectedOption ? 'selected' : ''
                                }`}
                                onClick={() => handleOptionClick(option)}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="no-options">병원이 없습니다.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;
