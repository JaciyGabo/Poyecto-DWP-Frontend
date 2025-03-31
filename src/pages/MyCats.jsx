import { Row } from "antd";
import { useState, useEffect } from "react";
import CatsShaWithMe from "../components/CatsShaWhitMe/CatsShaWhitMe";
import LoveCats from "../components/LoveCats/LoveCats";

const MyCats = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 992
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth > 768 && window.innerWidth <= 992
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: "79vh", 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'flex-start', // Cambiado a flex-start para mejor alineación
      padding: screenSize.isMobile ? "10px 5px" : "20px",
      width: "100%"
    }}>
      <Row 
        gutter={[16, 16]} 
        justify="space-between"
        style={{ width: "100%" }}
      >
        {/* Ambos componentes mantendrán su posición en cualquier tamaño de pantalla */}
        <CatsShaWithMe screenSize={screenSize} />
        <LoveCats screenSize={screenSize} />
      </Row>
    </div>
  );
};

export default MyCats;
