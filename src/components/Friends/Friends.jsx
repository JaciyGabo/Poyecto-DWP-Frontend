import { Avatar, Button, Card, Col, Row, message } from "antd";
import { useState, useEffect } from "react";
import { getFriendsList } from "../../api/api";

const Friends = ({ screenSize, shouldRefreshFriends, friendsList, setFriendsList }) => {
  const { isMobile, isTablet } = screenSize || {
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 992
  };

  const [loading, setLoading] = useState(true);

  // Función para cargar los amigos
  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await getFriendsList();
      console.log("Response from getFriendsList:", response);
      // Asegúrate de que response es un array antes de mapear
      const friendsArray = Array.isArray(response) ? response : response.friends || [];

      const mappedFriends = friendsArray.map(friend => ({
        email: friend.username,
        name: getDisplayName(friend.username),
        color: getAvatarColor(friend.username)
      }));
      
      setFriendsList(mappedFriends);
    } catch (error) {
      console.error("Error fetching friends:", error);
      message.error(error.message || "Error al cargar amigos");
    } finally {
      setLoading(false);
    }
  };

  // Cargar amigos al inicio y cuando cambie shouldRefreshFriends
  useEffect(() => {
    fetchFriends();
  }, [shouldRefreshFriends]);

  // Función para convertir email a nombre mostrable
  const getDisplayName = (email) => {
    if (!email) return "Amigo";
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return email;

    const username = email.substring(0, atIndex);
    // Convertir "john.doe" a "John Doe"
    return username
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  };

  // Función para generar color consistente desde el email
  const getAvatarColor = (email) => {
    const colors = ['#ff8c00', '#008000', '#ff4d4f', '#09555B', '#67AB9F'];
    if (!email) return colors[0];
    const hash = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Card
      style={{
        backgroundColor: "#E2E9EE",
        borderRadius: "25px",
        padding: isMobile ? "5px" : "10px",
        height: "100%",
        minHeight: loading ? "300px" : "auto"
      }}
      loading={loading}
    >
      <Row
        gutter={[isMobile ? 8 : 16, 16]}
        justify="center"
      >
        {friendsList.length === 0 && !loading ? (
          <Col span={24} style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#09555B', fontSize: isMobile ? '14px' : '16px' }}>
              Aún no tienes amigos agregados
            </p>
          </Col>
        ) : (
          friendsList.map((friend, index) => (
            <Col
              key={`${friend.email}-${index}`}
              xs={12}
              sm={12}
              md={isTablet ? 12 : 6}
              lg={6}
              xl={6}
              style={{ marginBottom: isMobile ? "10px" : "0" }}
            >
              <Card
                style={{
                  textAlign: "center",
                  borderRadius: "15px",
                  padding: isMobile ? "5px" : "10px",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              >
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}>
                  <Avatar
                    size={isMobile ? 60 : isTablet ? 80 : 100}
                    style={{ backgroundColor: friend.color }}
                  >
                    {friend.name[0].toUpperCase()}
                  </Avatar>
                  <Button
                    type="primary"
                    style={{
                      backgroundColor: "#FFC857",
                      border: "none",
                      color: "#09555B",
                      borderRadius: "10px",
                      marginTop: "10px",
                      fontSize: isMobile ? "12px" : "14px",
                      padding: isMobile ? "0 8px" : "0 10px",
                      height: isMobile ? "28px" : "32px",
                      whiteSpace: "normal",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      maxWidth: "100%",
                      lineHeight: "1.2"
                    }}
                  >
                    {friend.name}
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Card>
  );
};

export default Friends;