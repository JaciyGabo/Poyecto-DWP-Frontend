import { useNavigate } from "react-router-dom";
import ojosGato from "../../assets/error.png";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#3B3B3B", // Fondo oscuro
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      {/* Imagen de error */}
      <img 
        src={ojosGato} 
        alt="Error" 
        style={{ width: "500px", maxWidth: "80%", marginBottom: "20px" }} 
      />

      {/* Botón para ir a Login */}
      <button
        onClick={() => navigate("/login")}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          backgroundColor: "#28979f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1e6f74")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#28979f")}
      >
        Ir a Login
      </button>
    </div>
  );
};

export default Error;
