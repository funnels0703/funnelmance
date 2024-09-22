import React from "react";

function Header() {
  const userId = "이재연";
  const userColor = "#4C61CC";
  const displayUserId = userId.slice(0, 2).toUpperCase();

  return (
    <header>
      <div className="logo">Funnel Solution</div>
      <div className="user-id">
        <span style={{ backgroundColor: userColor }}>{displayUserId}</span>
        <p>{userId}</p>
      </div>

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
            background: linear-gradient(90deg, #4880ff 0%, #2b4d99 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 18px;
            font-weight: 900;
          }

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
        }
      `}</style>
    </header>
  );
}

export default Header;
