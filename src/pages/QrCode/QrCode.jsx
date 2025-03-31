import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import CustomButton from "../../components/CustomButton/CustomButton"
import { useNavigate } from "react-router-dom";
import ojosGato from "../../assets/ojosGato.jpg";

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urlOTP = location.state?.urlOTP || ""; // Obtener la URL del QR desde el estado de la ubicación

    //console.log("URL OTP:", urlOTP); // Verificar si la URL se está obteniendo correctamente

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
          <p>Escanea este QR con Google Authenticator</p>
        </div>

        <div style={{ padding: "20px", marginTop: "10px", backgroundColor: "white", borderRadius: "10px", display: "inline-block" }}>
            {urlOTP ? <QRCodeSVG value={urlOTP}/> : <p style={{ color: "black" }}>Cargando QR...</p>}
        </div>

          

        {/* Botones */}
        <div style={{ marginBottom: "0px", marginTop: "10px" }}>

          <CustomButton onClick={() => navigate("/login")} text="Regresar" />

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
