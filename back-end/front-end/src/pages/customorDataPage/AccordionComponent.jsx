import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

function AccordionComponent({ recentSettings }) {
  const [isOpen, setIsOpen] = useState(false); // 기본적으로 닫혀있는 상태

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion-container">
      <div className="accordion-header" onClick={toggleAccordion}>
        <h3>선택된 매체 광고</h3>
        <FontAwesomeIcon
          icon={isOpen ? faChevronUp : faChevronDown}
          className="arrow"
        />
      </div>
      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
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
    </div>
  );
}

export default AccordionComponent;
