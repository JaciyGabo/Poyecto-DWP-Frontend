import { useState, useEffect } from "react";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ojosGato from "../assets/ojosGato.jpg";
import CustomButton from "../components/CustomButton/CustomButton"
import { logoutUser } from "../api/api";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(null); // Inicializamos en null

  useEffect(() => {
  
    const logout = () => {
      try{
         const data = logoutUser();
         data.message.success("Sesión cerrada correctamente");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    }

    logout();

  }, []);

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

        <div style={{ color: "white", fontFamily: "Zain", fontSize: "1.5rem" }}>
          <p>Bienvenido a</p>
        </div>

        <div
          style={{
            color: "white",
            fontFamily: "Cherry Bomb One",
            fontSize: "3rem",
            marginBottom: "0px",
          }}
        >
          PrrSaga
        </div>

        {showLogin !== null && (
          <div
            style={{
              backgroundColor: "#000",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              margin: "0 auto",
              zIndex: 1,
            }}
          >
            {showLogin ? (
              <Login setShowLogin={setShowLogin} />  // ✅ Pásalo también al Login
            ) : (
              <Register setShowLogin={setShowLogin} />
            )}
          </div>
        )}

        {/* Botones */}
        <div style={{ marginBottom: "0px", marginTop: "10px" }}>

          <CustomButton onClick={() => setShowLogin(true)} text="Iniciar sesión" />
          <CustomButton onClick={() => setShowLogin(false)} text="Registrarse" />

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
