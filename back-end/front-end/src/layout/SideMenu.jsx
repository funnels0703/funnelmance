import React, { useState } from "react";
import { Link } from "react-router-dom";

function SideMenu() {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggleSubMenu = (index) => {
    setOpenIndexes((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const menuItems = [
    { title: "메인", path: "/" },
    { title: "디비리스트", path: "/db" },
    {
      title: "광고비입력",
      path: "/ad-cost",
      subMenu: [
        { title: "광고비입력", path: "/" },
        { title: "히스토리", path: "/" },
      ],
    },
    { title: "성과 리포트", path: "/" },
    {
      title: "TM",
      path: "/tm",
      subMenu: [
        { title: "담당자 업무 현황", path: "/tm" },
        { title: "방문 데이터", path: "/" },
        { title: "예약달력", path: "/" },
        { title: "공지", path: "/" },
      ],
    },
    {
      title: "코드 생성",
      path: "/code-generator",
    },
    {
      title: "관리자 페이지",
      path: "/admin",
      subMenu: [
        { title: "병원/이벤트/매체 리스트", path: "/admin/listsetting" },
        { title: "지점별 이벤트", path: "/" },
      ],
    },
    { title: "휴지통", path: "/trashCanData" },
  ];

  return (
    <nav>
      <ul className="main_menu">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link to={item.path} onClick={() => toggleSubMenu(index)}>
              {item.title}
            </Link>
            {item.subMenu && openIndexes[index] && (
              <ul className="sub_menu">
                {item.subMenu.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link to={subItem.path}>{subItem.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <style jsx>{`
        nav {
          min-width: 200px;
          padding-top: 35px;
          height: 100%;
          background: var(--primary-600, #003181);
          box-shadow: 3px 0px 5px 0px rgba(152, 152, 152, 0.1);
          ul {
            display: flex;
            flex-direction: column;
            width: 100%;
          }
          li {
            width: 100%;
            a {
              display: inline-block;
              height: 50px;
              line-height: 50px;
              color: white;
              width: 100%;
              text-align: center;
            }
          }
          ul.main_menu {
            > li {
              background: var(--primary-600, #003181);
              &:nth-of-type(1) {
                a {
                  color: #77c2ff;
                }
              }
              a {
                font-size: 16px;
                font-weight: 700;
              }
            }
          }
          ul.sub_menu {
            > li {
              background: #002061;
              a {
                font-size: 14px;
                font-weight: 500;
              }
            }
          }
        }
      `}</style>
    </nav>
  );
}

export default SideMenu;
