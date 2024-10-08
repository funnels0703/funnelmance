// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound.jsx";
import CodeGenerator from "./pages/code/CodeGenerator.jsx";
import CodePage from "./pages/code/CodePage.jsx";
import CustomorDataPage from "./pages/customorDataPage/CustomorDataPage.jsx";

import Layout from "./layout/Layout.jsx";
import TabComponent from "./pages/admin/listsetting/TabComponent.jsx";
import UserManagement from "./pages/admin/user/UserManagement.jsx";
import NoticeBoard from "./pages/tm/NoticeBoard.jsx";
import NoticeDetail from "./pages/tm/NoticeDetail.jsx";
import Login from "./pages/login/Login.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/code-generator" element={<CodeGenerator />} />
            <Route path="/:code/:urlCode" element={<CodePage />} />
            {/* URL 코드에 따른 페이지 */}
            <Route
              path="/db"
              element={
                <CustomorDataPage
                  title="접수자 리스트"
                  get_status={0}
                  put_status={1}
                />
              }
            />
            <Route
              path="/trashCanData"
              element={
                <CustomorDataPage
                  title="휴지통"
                  get_status={1}
                  put_status={0}
                />
              }
            />
            {/* 관리자 */}
            <Route path="/admin/listsetting" element={<TabComponent />} />
            <Route path="/admin/UserManagement" element={<UserManagement />} />

            {/* TM - 공지 */}
            <Route path="/tm/notices" element={<NoticeBoard />} />
            <Route path="/tm/notices/new" element={<NoticeDetail />} />
            <Route path="/tm/notices/:id" element={<NoticeDetail />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
