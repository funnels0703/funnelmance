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
            border: 1px #efefef;
            overflow-y: auto;

            .container_flex {
              display: flex;
              flex-direction: row;
              gap: 27px;
            }

            .container_left {
              width: 1080px;
            }
            .container_right {
              width: 400px;
            }

            .container {
              width: 100%;
            }

            .container,
            .container_left {
              padding: 57px 70px;
              border-radius: 10px;
              background-color: #fff;
            }
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;
