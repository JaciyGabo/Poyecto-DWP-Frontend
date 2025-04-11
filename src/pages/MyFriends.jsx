// MyFriends.jsx - Con estado y función compartidos
import { Row, Col } from "antd";
import { useState, useEffect } from "react";
import Friends from "../components/Friends/Friends";
import AddFriend from "../components/AddFriend/AddFriend";
import FriendRequest from "../components/FriendRequest/FriendRequest";

const MyFriends = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 992
  });
  
  // Estado compartido para la lista de amigos
  const [friendsList, setFriendsList] = useState([]);
  const [shouldRefreshFriends, setShouldRefreshFriends] = useState(false);

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

  // Función para actualizar amigos que se pasará a ambos componentes
  const refreshFriends = () => {
    setShouldRefreshFriends(prev => !prev);
  };

  return (
    <div style={{ 
      minHeight: "79vh", 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: screenSize.isMobile ? "10px 5px" : "20px"
    }}>
      <Row gutter={[20, 20]} justify="space-between" style={{ width: "100%" }}>
        {/* Sección de Amigos - En móvil ocupará toda la pantalla */}
        <Col xs={24} sm={24} md={16} lg={17} xl={17}>
          <Friends 
            screenSize={screenSize} 
            friendsList={friendsList}
            setFriendsList={setFriendsList}
            shouldRefreshFriends={shouldRefreshFriends}
          />
        </Col>

        {/* Panel derecho - En móvil se mostrará debajo */}
        <Col xs={24} sm={24} md={8} lg={7} xl={7}>
          <AddFriend refreshFriends={refreshFriends} />
          <FriendRequest refreshFriends={refreshFriends} />
        </Col>
      </Row>
    </div>
  );
};

export default MyFriends;