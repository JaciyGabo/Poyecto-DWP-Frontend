import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import "./Login.css"
import { loginUser } from "../../api/api";
const { Title, Text } = Typography;

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessagee] = useState("");
  const [email, setEmail] = useState("");

  const handleLogin = async (values) => {
    try {
      setEmail(values.username);
      const data = await loginUser(values.username, values.password);
      console.log(data);
      localStorage.setItem("token", data.token);
      setShowModal(true);
      setMessagee(data.message);
    } catch (error) {
      console.error(error.message);
      setError("Error de conexión al servidor");
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    if (messagee === "Inicio de sesión exitoso") {
      navigate("/dashboard");
    }
    if (messagee === "Verifica tu cuenta") {
      navigate("/verify-otp", { state: { email: email } });
    }
  };

  return (
    <div>
      <Card className="login-card">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
            Inicio de sesión
          </Title>

          {error && (
            <Text type="danger" style={{ textAlign: "center", display: "block" }}>
              {error}
            </Text>
          )}

          <Form onFinish={handleLogin} style={{ width: "100%" }}>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Correo:
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "¡Ingrese su usuario!" }, { type: "email", message: "¡Ingrese un email válido!" }]}
            >
              <Input
                placeholder="Email"
                style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px" }}
                className="custom-placeholder"
              />
            </Form.Item>
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "70%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
              >
                Ingresar
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="link"
                onClick={() => navigate("/recover-pass")} // Cambia la ruta según tu configuración
                style={{
                  color: "#fff",
                  textDecoration: "underline",
                }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>

      {showModal && (
        <section className="modal" >
          <p>
            <strong>{messagee}</strong>
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
  );
};

export default Login;

