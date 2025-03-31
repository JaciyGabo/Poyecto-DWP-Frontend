
import ojosGato from "../../assets/ojosGato.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import "../Login/Login.css"
import { verifyEmail, verifyToken } from "../../api/api";
const { Title, Text } = Typography;


const RecoverPass = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessage] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [email, setEmail] = useState("");
  const [goToUpdatePass, setGoToUpdatePass] = useState(false);

  const handleEmailSubmit = async (values) => {  // Ant Design pasa los valores del formulario aquí
    try {
      setEmail(values.username);
      const data = await verifyEmail(values.username);

      if (data.message === "Correo verificado") {
        setIsEmailValid(true);
        setMessage(data.message);
        setShowModal(true);
        setError("");
      }
    } catch (error) {
      setIsEmailValid(false);
      const errorMessage = error.response?.data?.message || "Error al verificar el correo";
      setError(errorMessage);
      setMessage(errorMessage);
    }
  };

  const handleTokenSubmit = async (values) => {
    try {
      const data = await verifyToken(email, values.token);
      console.log(data);
      setMessage(data.message);
      setShowModal(true);
      setGoToUpdatePass(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error al verificar el token";
      setError(errorMessage);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    if (goToUpdatePass) {
      navigate("/update-password", { state: { email } });
    }
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
              Recuperar contraseña
            </Title>

            {error && (
              <Text type="danger" style={{ textAlign: "center", display: "block" }}>
                {error}
              </Text>
            )}

            <Form onFinish={handleEmailSubmit} style={{ width: "100%", }}>
              <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
                Correo:
              </div>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "¡Ingrese su usuario!" }, { type: "email", message: "¡Ingrese un email válido!" }]}
              >
                <Input
                  placeholder="Email"
                  style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
                  className="custom-placeholder"
                />
              </Form.Item>

              <Form.Item >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: "0px", width: "70%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
                >
                  Verificar Correo
                </Button>
              </Form.Item>

            </Form>

            {isEmailValid && (
              <Form onFinish={handleTokenSubmit} style={{ width: "100%", }}>
                <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
                  Token:
                </div>
                <Form.Item
                  name="token"
                  rules={[{ required: true, message: "¡Ingrese su token!" }, { type: "text", message: "¡Ingrese un token válido!" }]}
                >
                  <Input
                    placeholder="Token"
                    style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
                    className="custom-placeholder"
                  />
                </Form.Item>

                <Form.Item >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginTop: "0px", width: "70%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
                  >
                    Verificar Token
                  </Button>
                </Form.Item>

              </Form>
            )}

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
export default RecoverPass