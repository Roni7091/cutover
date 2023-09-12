import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/welcome";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SingupPage";
import TaskTable from "./components/tasktable";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container mt-5">
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/tasktable" element={<TaskTable />} />
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
