import { Layout, Menu, Dropdown, Avatar, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/PrrSagaLogo.png";
import { Link } from "react-router-dom";
import './dash.css'
import CustomMenu from "../components/CustomMenu/CustomMenu";
import { useState, useEffect } from "react";
const { Header, Content } = Layout;


const MainLayout = ({ children }) => {

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  }

  return (
    <Layout className="main-layout">
      <Layout style={{ background: "#b0cfd1" }}>
        <Header
        className="responsive-header"
          style={{
            background: "#09555B",
            padding: "0 20px", 
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", 
            minHeight: isMobile ? "70px" : "100px",
            height: "auto", 
            position: "relative", 
          }}
        >
          {/* Foto y título */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={logo} // URL de la foto
              size={isMobile ? 50 : 80} 
              style={{ margin: isMobile ? "10px 0" : "0" }}
            />
          </div>

          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined style={{ color: "white", fontSize: "24px" }} />}
              onClick={toggleMenu}
              style={{ background: "transparent", border: "none" }}
            />
          )}

          {/* Menú de enlaces */}
          {(!isMobile || menuVisible) && (
          <Menu
            theme="light"
            mode={isMobile ? "vertical" : "horizontal"}
            defaultSelectedKeys={["inicio"]}
            style={{
              background: "transparent",
              width: isMobile ? "100%" : "auto",
              flex: isMobile ? "none" : 1,
              justifyContent: isMobile ? "flex-start" : "center",
              display: isMobile ? (menuVisible ? "block" : "none") : "flex"
            }}
            className="custom-menu"
          >
            <Menu.Item key="inicio" >
              <Link to="/dashboard">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="amigos" >
              <Link to="/my-friends">Mis amigos</Link>
            </Menu.Item>
            <Menu.Item key="gatos" >
              <Link to="/my-cats">Mis gatos</Link>
            </Menu.Item>
          </Menu>
          )}

          {/* Menú desplegable */}
          {!isMobile && (
          <Dropdown overlay={<CustomMenu />} trigger={["click"]}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Avatar
                size={50}
                icon={<MenuOutlined />}
              />
            </div>
          </Dropdown>
          )}
        </Header>

        <Content
          style={{
            padding: "16px",
            background: "#202020",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            height: "calc(100vh - var(--header-height))",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

