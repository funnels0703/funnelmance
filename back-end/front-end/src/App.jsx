// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./components/NotFound.jsx";
import CodeGenerator from "./pages/code/CodeGenerator.jsx";
import CodePage from "./pages/code/CodePage.jsx";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/code-generator" element={<CodeGenerator />} />
          <Route path="/:code/:urlCode" element={<CodePage />} />
          {/* URL 코드에 따른 페이지 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
