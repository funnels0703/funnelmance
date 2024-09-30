import React from 'react';

import SideMenu from './SideMenu';
import Header from './Header';

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
                        overflow-x: hidden;
                         {
                            /* overflow-y: hidden; */
                        }
                    }

                    .content {
                        flex-grow: 1;
                        margin: 47px 27px;
                        border: 1px #efefef;

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
                            height: 100%;
                            overflow-y: auto;
                        }

                        .container::-webkit-scrollbar,
                        .container_left::-webkit-scrollbar {
                            width: 6px; /* 스크롤바의 너비를 얇게 설정 (6px) */
                        }

                        .container::-webkit-scrollbar-track,
                        .container_left::-webkit-scrollbar-track {
                            background: transparent; /* 스크롤 트랙(배경)은 투명하게 설정 */
                        }

                        .container::-webkit-scrollbar-thumb,
                        .container_left::-webkit-scrollbar-thumb {
                            background-color: #d9d9d9; /* 스크롤바의 thumb 색상을 연한 회색으로 설정 */
                            border-radius: 10px; /* 둥근 모서리 */
                        }

                        .container::-webkit-scrollbar-thumb:hover,
                        .container_left::-webkit-scrollbar-thumb:hover {
                            background-color: #b0b0b0; /* 스크롤바에 호버 시 색상을 약간 진하게 설정 */
                        }
                    }
                }
            `}</style>
        </div>
    );
}

export default Layout;
