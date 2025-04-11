import { useState, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ojosGato from "../../assets/ojosGato.jpg";
import { verifyOTP } from "../../api/api"; // Asegúrate de importar la función verifyOTP desde tu archivo api.js

const VeriryOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ""; // Obtener la URL del QR desde el estado de la ubicación
    const [showModal, setShowModal] = useState(false);
    const [messagee, setMessagee] = useState("");


    const handleVerify = async (values) => {
        try {
            const response = await verifyOTP(email, values.OTP); // Cambia esto según tu API
            console.log("Respuesta de la API:", response);
            setMessagee(response.message);
            setShowModal(true);
            if (response.status === 200) {
                navigate("/update-password", { state: { email: email } }); // Redirigir a la página de actualización de contraseña
            } else {
                console.error("Error al verificar OTP:", response.data.message);
            }
        } catch (error) {
            console.error("Error al verificar OTP:", error.message);
        }
    }

    const cerrarModal = () => {
        setShowModal(false);

        
          navigate("/dashboard"); // Redirigir a la página de inicio de sesión
      };
    

  return (
    <div
      className="form-box"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        backgroundImage: `url(${ojosGato})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative", // Para poder aplicar un filtro en el fondo
      }}
    >
      {/* Fondo con difuminado */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Filtro oscuro para mejorar la legibilidad
        }}
      > </div>

      <div style={{ zIndex: 1, textAlign: "center" }}>

        <div
          style={{
            color: "white",
            fontFamily: "Cherry Bomb One",
            fontSize: "3rem",
            marginBottom: "15px",
          }}
        >
          PrrSaga
        </div>

        <div style={{ color: "white", fontFamily: "Zain", fontSize: "1.5rem" }}>
          <p>Verifica tu OTP</p>
        </div>

        <Form onFinish={handleVerify} style={{ width: "100%" }}>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              OTP:
            </div>
            <Form.Item
              name="OTP"
              rules={[{ required: true, message: "¡Ingrese su codigo OTP!" }, { type: "text", message: "¡Ingrese un email válido!" }]}
            >
              <Input
                placeholder="Ingrese su codigo OTP"
                style={{ width: "100%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px" }}
                className="custom-placeholder"
              />
            </Form.Item>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "70%", backgroundColor: "transparent", border: "2px solid #fff", color: "#fff", borderRadius: "30px", }}
              >
                Verificar
              </Button>
            </Form.Item>
    
          </Form>

        {/* Botones */}
        <div style={{ marginBottom: "0px", marginTop: "10px" }}>

          

        </div>
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
      
    </div>
  );
};

export default VeriryOTP;
