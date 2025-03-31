
import ojosGato from "../../assets/ojosGato.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import "../Login/Login.css"
import { updatePassword } from "../../api/api";
import { useLocation } from "react-router-dom";
const { Title, Text } = Typography;


const UpdatePass = () => {
  const location = useLocation();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessage] = useState("");
  const [email] = useState(location.state.email);


  const handlePasswordSubmit = async (values) => {
    try {
      const data = await updatePassword(email, values.password);
      setMessage(data.message);
      setShowModal(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al verificar el correo";
      setError(errorMessage);
    }
  };
  

  const cerrarModal = () => {
    setShowModal(false);
    navigate("/login");
  }

  return (
    <div
      className="form-box"
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5", backgroundImage: `url(${ojosGato})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative", }}
    >
      {/* Fondo con difuminado */}
      <div
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)", }}
      > </div>

      <div style={{ zIndex: 1, textAlign: "center" }}>

        <div
          style={{
            color: "white", fontFamily: "Cherry Bomb One", fontSize: "3rem", marginBottom: "15px",
          }}
        >
          PrrSaga
        </div>

        <Card className="login-card">
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
              Ingresa tu nueva contraseña 
            </Title>

            {error && (
              <Text type="danger" style={{ textAlign: "center", display: "block" }}>
                {error}
              </Text>
            )}

            <Form onFinish={handlePasswordSubmit} style={{ width: "100%", }}>
              <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
                Contraseña:
              </div>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "¡Ingrese su contraseña!" }]}
              >
                <Input.Password
                  placeholder="Contraseña"
                  style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px" }}
                  className="custom-password"
                />
              </Form.Item>

              <Form.Item >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: "0px", width: "70%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
                >
                  Guardar contraseña
                </Button>
              </Form.Item>

            </Form>

            

            <Button
              type="link"
              onClick={() => navigate("/login")} // Cambia la ruta según tu configuración
              style={{
                color: "#fff",
                textDecoration: "underline",
                margin: "0",
              }}
            >
              Regresar
            </Button>

          </Space>
        </Card>

        {showModal && (
          <section
            className="modal"
          >
            <p>
              <strong>{messagee}</strong> {/* Usando el estado messagee */}
            </p>
            <button
              className="cerrar"
              onClick={cerrarModal}
            >
              Cerrar
            </button>
          </section>
        )}

      </div>
    </div>
  );
}
export default UpdatePass