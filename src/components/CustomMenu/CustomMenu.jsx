import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

const CustomMenu = () => {
  const navigate = useNavigate();

  return (
    <Menu style={{ width: 200, background: "#28979f" }}>

      <Menu.Item
        key="logout"
        style={{ color: "white", fontSize: "20px", textAlign: "center" }}
        onClick={() => navigate("/login")}
      >
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
