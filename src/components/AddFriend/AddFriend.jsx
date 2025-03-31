import { Card, Button, Input, message } from "antd";
import { useState, useEffect } from "react";
import { sendFriendRequest } from "../../api/api"; // Ajusta la ruta según tu estructura

const AddFriend = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAddFriend = async () => {
    if (!email.trim()) {
      message.warning("Por favor ingresa un correo electrónico");
      return;
    }

    setLoading(true);
    try {
      await sendFriendRequest(email.trim());
      message.success("Solicitud de amistad enviada con éxito");
      setEmail(""); // Limpiar el campo después de enviar
    } catch (error) {
      console.error("Error sending friend request:", error);
      message.error(error.message || "Error al enviar solicitud de amistad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      style={{ 
        backgroundColor: "#E2E9EE", 
        borderRadius: "20px", 
        padding: isMobile ? "10px" : "15px" 
      }}
    >
      <Input 
        placeholder="Ingresa el correo electrónico" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ 
          marginBottom: "10px", 
          textAlign: "center", 
          borderRadius: '10px', 
          backgroundColor: '#09555B', 
          border: "2px solid #BAC8D3", 
          color: 'white', 
          flex: 1, 
          fontSize: isMobile ? "13px" : "14px",
          height: isMobile ? "32px" : "36px",
          '::placeholder': { color: 'rgba(255,255,255,0.7)' }, 
          WebkitTextFillColor: 'white' 
        }} 
      />
      <Button 
        type="primary" 
        onClick={handleAddFriend}
        loading={loading}
        style={{ 
          backgroundColor: "#ffc107", 
          border: "none", 
          width: "100%", 
          color: "#09555B", 
          borderRadius: "10px",
          fontSize: isMobile ? "13px" : "14px",
          height: isMobile ? "32px" : "36px"
        }}
      >
        Agregar a amigos
      </Button>
    </Card>
  );
};

export default AddFriend;