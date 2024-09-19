import React from "react";

import SideMenu from "./SideMenu";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <div className="main">
        <SideMenu />
        <div className="content">{children}</div>
      </div>

      <style jsx>{`
        .layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f5f6fa;
          .main {
            display: flex;
            flex-grow: 1;
          }

          .content {
            flex-grow: 1;
            margin: 47px 27px;
            background-color: white;
            border-radius: 10px;
            border: 1px #efefef;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;
