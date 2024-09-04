import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function AccordionComponent({ recentSettings }) {
    const [isOpen, setIsOpen] = useState(false); // 기본적으로 닫혀있는 상태

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="accordion-container">
            <div className="accordion-header" onClick={toggleAccordion}>
                <h3>선택된 매체 광고</h3>
                <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} className="arrow" />
            </div>
            <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
                <div className="card-container">
                    {recentSettings &&
                        recentSettings.map((setting, index) => (
                            <div className="card" key={setting.id}>
                                <div className="card-title">{setting.ad_title}</div>
                                <div className="card-count">DB 수 총 {setting.count}개</div>
                            </div>
                        ))}
                </div>
            </div>
            <style jsx>{`
                .accordion-container {
                    margin: 30px 0 20px;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .accordion-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                }

                .accordion-header h3 {
                    margin: 0;
                    color: #202224;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: normal;
                    padding: 15px 0 15px 21.22px;
                }

                .accordion-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out;
                    background-color: #fff;
                }

                .accordion-content.open {
                    max-height: 1000px; /* 최대 높이를 충분히 크게 설정 */
                    transition: max-height 0.5s ease-in;
                }

                .arrow {
                    font-size: 20px;
                    color: #707070;
                    transition: transform 0.3s ease;
                    margin-right: 20px;
                }

                .arrow.open {
                    transform: rotate(180deg);
                }

                .card-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    padding: 10px 242px 45px;
                    justify-content: space-between; /* 카드 사이 간격을 고르게 */
                }

                .card {
                    background: linear-gradient(180deg, #4880ff 0%, #2b4d99 100%); /* 그라디언트 색상 */
                    color: white;
                    border-radius: 5px;
                    padding: 10px;
                    width: 250px; /* 4개의 카드가 한 줄에 나열되도록 설정 */
                    height: 70px; /* 고정된 높이 */
                    text-align: center;
                    cursor: pointer;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    display: flex;
                    flex-direction: column;
                    justify-content: center; /* 수직 정렬 */
                }

                /* 호버 시 색상 변화를 없앱니다 */
                .card:hover {
                    background: linear-gradient(180deg, #4880ff 0%, #2b4d99 100%);
                    transform: none;
                }

                .card-title {
                    font-size: 0.9rem;
                    margin-bottom: 5px;
                }

                .card-count {
                    font-size: 0.8rem;
                    font-weight: normal;
                    font-weight: bold;
                }

                @media (max-width: 768px) {
                    .card {
                        width: calc(50% - 10px); /* 작은 화면에서는 2개씩 한 줄에 나열되도록 설정 */
                        margin-bottom: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .card {
                        width: 100%; /* 더 작은 화면에서는 한 줄에 카드 하나만 나열 */
                        margin-bottom: 10px;
                    }
                }
            `}</style>
        </div>
    );
}

export default AccordionComponent;
