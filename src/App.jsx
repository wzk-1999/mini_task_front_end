import React from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import ChatRobot from "./pages/ChatRobot";
import Profile from "./pages/Profile";

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ height: "100vh" , width:"99vw"}}>
        <Header />
        <Content style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<ChatRobot />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
