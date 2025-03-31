import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space, message } from "antd";
import "../Login/Login.css";
import { registerUser } from "../../api/api";
const { Title } = Typography;

const Register = ({ setShowLogin }) => {  // ✅ Debe estar definido en los parámetros
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessagee] = useState("");
  const [urlOTP, setUrlOTP] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const data = await registerUser(values);
      setUrlOTP(data.secret)
      message.success(data.message || "Usuario creado correctamente.");
      setShowModal(true);
      setMessagee(data.message || "Usuario creado correctamente");
    } catch (error) {
      message.error(error.message || "Error en el registro.");
      setShowModal(true);
      setMessagee(error.message);
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false)
    navigate("/qr-code", { state: { urlOTP } }); 
  }

  return (
    <div>
      <Card className="login-card">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
            Registrarse
          </Title>

          <Form onFinish={handleRegister} style={{ width: "100%" }}>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Usuario:
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "¡Ingrese su usuario!" }]}
            >
              <Input placeholder="Usuario"
                style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px" }}
                className="custom-placeholder"
              />

            </Form.Item>


            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Correo:
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "¡Ingrese su email!" },
                { type: "email", message: "¡Ingrese un email válido!" }
              ]}
            >
              <Input placeholder="Correo Electrónico"
                style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
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
              <Input.Password placeholder="Contraseña"
                style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px" }}
                className="custom-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "70%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px"}}
              >
                Registrarse
              </Button>
            </Form.Item>


          </Form>
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
  );
};

export default Register;
