import React from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const menuItems = [
  { key: "1", label: <Link to="/">Chat Robot</Link> },
  { key: "2", label: <Link to="/profile">Vistor Profile</Link> },
];

const AppHeader = () => (
  <Header  style={{
    position: 'sticky',
    top: 0,
    zIndex: 1,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    
  }}>
    <Menu theme="dark" mode="horizontal" items={menuItems} />
  </Header>
);

export default AppHeader;
