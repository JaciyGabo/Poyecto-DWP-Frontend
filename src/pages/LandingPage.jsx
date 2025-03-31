import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ojosGato from "../assets/ojosGato.jpg";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${ojosGato})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      
    </div>
  );
};

export default LandingPage;
