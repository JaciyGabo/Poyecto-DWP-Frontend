import { Card, Avatar, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getFriendRequests, acceptFriendRequest } from "../../api/api";

const FriendRequest = ({ refreshFriends }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingRequests, setAcceptingRequests] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await getFriendRequests();
        if (response.requests) {
          setRequests(response.requests);
        } else if (response.message) {
          message.info(response.message);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        message.error(error.message || "Error al cargar solicitudes");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (fromUser, requestId) => {
    setAcceptingRequests(prev => ({ ...prev, [requestId]: true }));
    try {
      await acceptFriendRequest(fromUser);
      message.success(`Solicitud de ${getDisplayName(fromUser)} aceptada`);
      setRequests(prev => prev.filter(req => req.fromUser !== fromUser));
      
      // Aquí llamamos a la función para actualizar la lista de amigos
      refreshFriends();
      
    } catch (error) {
      console.error("Error accepting request:", error);
      message.error(error.message || "Error al aceptar solicitud");
    } finally {
      setAcceptingRequests(prev => ({ ...prev, [requestId]: false }));
    }
  };

  // Función para extraer el nombre del email
  const getDisplayName = (email) => {
    const atIndex = email.indexOf('@');
    return atIndex > 0 ? 
      email.substring(0, atIndex).replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
      email;
  };

  // Colores consistentes basados en el email
  const getAvatarColor = (email) => {
    const colors = ['#ff8c00', '#008000', '#ff4d4f', '#09555B', '#67AB9F'];
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Card 
      style={{ 
        backgroundColor: "#E2E9EE", 
        borderRadius: "15px", 
        marginTop: "15px", 
        padding: isMobile ? "5px" : "10px",
        minHeight: loading ? "200px" : "auto"
      }}
      loading={loading && requests.length === 0}
    >
      <p style={{ 
        marginBottom: "10px", 
        textAlign: "center", 
        borderRadius: '10px', 
        backgroundColor: '#09555B', 
        border: "2px solid #BAC8D3", 
        color: 'white', 
        flex: 1, 
        fontSize: isMobile ? "13px" : "15px", 
        padding: "5px" 
      }}>
        Invitaciones de amistad
      </p>

      {requests.length === 0 && !loading && (
        <p style={{ textAlign: 'center', color: '#09555B', padding: '10px' }}>
          No tienes solicitudes pendientes
        </p>
      )}

      {requests.map((request) => (
        <Card
          key={request.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            borderRadius: "15px",
            backgroundColor: "#67AB9F",
            padding: "8px 12px",
            width: "100%",
            border: "none"
          }}
          bodyStyle={{
            padding: 0,
            display: "flex",
            alignItems: "center",
            width: "100%"
          }}
        >
          <Avatar 
            size={isMobile ? 40 : 50}
            style={{ 
              backgroundColor: getAvatarColor(request.fromUser),
              flexShrink: 0,
              marginRight: "12px"
            }}
          >
            {getDisplayName(request.fromUser)[0].toUpperCase()}
          </Avatar>
        
          <div style={{
            flex: 1,
            minWidth: 0,
            marginRight: "12px",
            background: "#FFC857",
            borderRadius: "10px",
            padding: "8px 12px",
            overflow: "hidden"
          }}>
            <span style={{
              display: "block",
              fontSize: isMobile ? "13px" : "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "#09555B",
              fontWeight: 500
            }}>
              {getDisplayName(request.fromUser)}
            </span>
          </div>
        
          <Button 
            shape="circle" 
            icon={<PlusOutlined />}
            size={isMobile ? "small" : "middle"}
            style={{ 
              flexShrink: 0,
              backgroundColor: "#09555B",
              color: "#FFC857",
              border: "none"
            }}
            loading={acceptingRequests[request.id]}
            onClick={() => handleAccept(request.fromUser, request.id)}
          />
        </Card>
      ))}
    </Card>
  );
};

export default FriendRequest;