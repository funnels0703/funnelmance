import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function SideMenu() {
  const [openIndexes, setOpenIndexes] = useState({});
  const location = useLocation();

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
        { title: "광고비입력", path: "/ad-cost" },
        { title: "히스토리", path: "/ad-cost/2" },
      ],
    },
    { title: "성과 리포트", path: "/dd" },
    {
      title: "TM",
      path: "/tm",
      subMenu: [
        { title: "담당자 업무 현황", path: "/tm" },
        { title: "방문 데이터", path: "/tm/1" },
        { title: "예약달력", path: "/tm/2" },
        { title: "공지", path: "/tm/notices" },
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
        { title: "지점별 이벤트", path: "/admin/1" },
        { title: "계정 관리", path: "/admin/UserManagement" },
      ],
    },
    { title: "휴지통", path: "/trashCanData" },
  ];

  const isMainMenuActive = (menu) => {
    return (
      location.pathname === menu.path ||
      (menu.subMenu &&
        menu.subMenu.some((subItem) => location.pathname === subItem.path))
    );
  };

  return (
    <nav>
      <ul className="main_menu">
        {menuItems.map((item, index) => {
          const isActive = isMainMenuActive(item);

          return (
            <li key={index}>
              <Link
                to={item.path}
                onClick={() => {
                  if (item.subMenu) toggleSubMenu(index);
                }}
                style={{ color: isActive ? "#77c2ff" : "white" }}
              >
                {item.title}
              </Link>
              {item.subMenu && (
                <ul
                  className="sub_menu"
                  style={{ display: openIndexes[index] ? "none" : "block" }}
                >
                  {item.subMenu.map((subItem, subIndex) => {
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <li key={subIndex}>
                        <Link
                          to={subItem.path}
                          style={{ color: isSubActive ? "#77c2ff" : "white" }}
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
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
              width: 100%;
              text-align: center;
            }
          }
          ul.main_menu {
            > li {
              background: var(--primary-600, #003181);
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
