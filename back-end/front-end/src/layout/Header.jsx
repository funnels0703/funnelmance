import React from "react";
import { Link, useLocation } from "react-router-dom";
function Header() {
  const userId = "이재연";
  const userColor = "#4C61CC";
  const displayUserId = userId.slice(0, 2).toUpperCase();

  const location = useLocation();
  // 로그인 페이지 여부 확인
  const isLoginPage = location.pathname === "/login";
  return (
    <header>
      <div className="logo">
        <span className="gradient-text">Funnel Solution</span>
        <span className="solid-text">Funnel Solution</span>
      </div>

      {!isLoginPage && (
        <div className="profile">
          <div className="sign_out">
            <Link to="/login">
              <img src="/images/header/sign-out.png" alt="로그아웃" />
            </Link>
          </div>
          <div className="user-id">
            <span style={{ backgroundColor: userColor }}>{displayUserId}</span>
            <p>{userId}</p>
          </div>
        </div>
      )}
      <style jsx>{`
        header {
          width: 100%;
          height: 60px;
          line-height: 60px;
          padding: 0 25px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          box-shadow: 0px 4px 15px 0px rgba(152, 152, 152, 0.2);
          .logo {
            position: relative;
            font-family: Pretendard;
            font-size: 18px;
            font-style: normal;
            font-weight: 900;
            line-height: normal;

            .gradient-text {
              background: linear-gradient(90deg, #4880ff 0%, #2b4d99 100%);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent; /* 텍스트 투명화 */
              position: absolute;
              left: 0;
              top: 0;
              z-index: 1; /* 위에 위치 */
            }

            .solid-text {
              color: #003181; /* 두께를 나타내기 위한 색상 */
              position: relative;
              z-index: 0; /* 아래에 위치 */
            }
          }
          .profile {
            height: 100%;
            display: flex;
            align-items: center;
            gap: 30px;
            .user-id {
              display: flex;
              justify-content: center;
              gap: 10px;
              align-items: center;
              font-weight: 500;
              span {
                width: 40px;
                height: 40px;
                line-height: 40px;
                border-radius: 50%;
                font-size: 16px;
                color: white;
                display: block;
                text-align: center;
              }
              p {
                color: #343434;
                font-size: 16px;
              }
            }
            .sign_out {
              width: 35px;
              height: 35px;
              cursor: pointer;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              align-items: center;
              a {
                display: inherit;
              }
              img {
                width: 75%;
              }
            }
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
