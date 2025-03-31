import { Card, Button, Row, Col, Image, message, Modal, Select, Input } from "antd";
import { HeartOutlined, HeartFilled, DownloadOutlined, SyncOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { getFavoriteCats, shareCatPhoto, getFriendsList, removeFavorite } from '../../api/api';

const { Option } = Select;

const LoveCats = ({ screenSize }) => {
  const { isMobile, isTablet } = screenSize || {
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 992
  };

  const [favoriteCats, setFavoriteCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [liked, setLiked] = useState(true);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [textEdit, setTextEdit] = useState('');

  // Objeto para almacenar referencias a las imágenes
  const imageRefs = useRef({});

  // Función para cargar favoritos
  const loadFavorites = async (reset = false) => {
    try {
      setLoading(true);
      const response = await getFavoriteCats(reset ? null : lastVisible);
      console.log(response)
      setFavoriteCats(prev => reset ? response.favorites : [...prev, ...response.favorites]);
      setLastVisible(response.lastVisible);
      setHasMore(response.favorites.length === 10); // Asume que hay más si devuelve 10
    } catch (error) {
      console.error("Error loading favorites:", error);
      message.error(error.message || "Error al cargar favoritos");
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    try {
      const friendsList = await getFriendsList();
      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
      message.error(error.message || 'Error al cargar amigos');
    }
  };

  // Cargar inicialmente
  useEffect(() => {
    loadFavorites(true);
    loadFriends();
  }, []);

  // Función para manejar scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
        loading ||
        !hasMore
      ) {
        return;
      }
      loadFavorites();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, lastVisible]);

  // Función para descargar la imagen que se está mostrando
  const handleDownload = (catId, catName = 'cat-image') => {
    try {
      const imgElement = imageRefs.current[catId];
      if (!imgElement) {
        message.error('No se pudo encontrar la imagen');
        console.error('No image reference found for:', catId);
        return;
      }

      // Crear un canvas para capturar la imagen actual
      const canvas = document.createElement('canvas');
      canvas.width = imgElement.naturalWidth || imgElement.width;
      canvas.height = imgElement.naturalHeight || imgElement.height;

      const ctx = canvas.getContext('2d');
      // Dibujar la imagen actual en el canvas
      ctx.drawImage(imgElement, 0, 0);

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${catName.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        message.success('¡Imagen descargada con éxito!');
      }, 'image/jpeg', 0.95);
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      message.error('No se pudo descargar la imagen');
    }
  };

  const openShareModal = (cat) => {
    if (friends.length === 0) {
      message.warning('No tienes amigos para compartir');
      return;
    }
    setSelectedCat(cat);
    setShareModalVisible(true);
  };

  const handleShare = async () => {
    if (!selectedFriend || !selectedCat) {
      message.warning('Selecciona un amigo y una imagen');
      return;
    }

    setShareLoading(true);
    try {
      await shareCatPhoto(selectedFriend, selectedCat.url, textEdit || 'Mira este gato!');
      message.success('Foto compartida exitosamente');
      setShareModalVisible(false);
      setSelectedFriend(null);
      setTextEdit('');
    } catch (error) {
      console.error("Error sharing photo:", error);
      message.error(error.message || "Error al compartir foto");
    } finally {
      setShareLoading(false);
    }
  };


  const handleLike = async (catId) => {
    try {
      await removeFavorite(catId);
      setFavoriteCats((prevFavorites) => prevFavorites.filter(cat => cat.id !== catId));
      message.success("Gato eliminado de favoritos");
    } catch (error) {
      console.error("Error removing favorite:", error);
      message.error(error.message || "Error al eliminar el favorito");
    }
  };
  

  return (
    <Col xs={24} sm={24} md={16} lg={17} xl={17}>
      <Row gutter={[isMobile ? 8 : 16, isMobile ? 8 : 16]}>
        {favoriteCats.map((cat, index) => {
          const catId = cat.id || `cat-${index}`;
          return (
            <Col xs={12} sm={12} md={isTablet ? 12 : 8} lg={8} xl={8} key={catId}>
              <Card
                style={{  backgroundColor: "#dfe6e9", borderRadius: "15px", padding: isMobile ? "5px" : "10px", textAlign: "center", height: "100%", display: "flex", flexDirection: "column" }}
                bodyStyle={{ padding: isMobile ? "8px" : "12px", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}
                cover={
                  <div
                    style={{ overflow: "hidden", borderRadius: "10px", height: isMobile ? "120px" : "150px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {/* Usamos una imagen normal en lugar del componente Image de Ant Design para mejor control */}
                    <img
                      ref={el => imageRefs.current[catId] = el}
                      src={cat.url}
                      alt={cat.text || "Gato favorito"}
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.src = "https://placekitten.com/300/300"; // Fallback image
                      }}
                      crossOrigin="anonymous" // Importante para poder manipular la imagen
                    />
                  </div>
                }
              >
                {/* Mostrar el nombre del gato */}
                <div style={{ marginBottom: "8px", fontSize: isMobile ? "12px" : "14px", fontWeight: "bold", color: "#09555B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {cat.text || "Gato favorito"}
                </div>

                <Row
                  justify="center"
                  gutter={isMobile ? 4 : 8}
                  style={{ marginTop: "auto" }}
                >
                  <Col>
                    <Button
                      shape="circle"
                      icon={liked ? <HeartFilled style={{ color: "red" }} /> : <HeartOutlined style={{ color: "red" }} />}
                      size={isMobile ? "small" : "middle"}
                      onClick={() => handleLike(cat.id)}
                    />
                  </Col>
                  <Col>
                    <Button
                      shape="circle"
                      icon={<DownloadOutlined />}
                      size={isMobile ? "small" : "middle"}
                      onClick={() => handleDownload(catId, cat.text || "cat-image")}
                    />
                  </Col>

                  {(!isMobile || index % 2 !== 0) && (
                    <Col>
                      <Button
                        shape="circle"
                        icon={<SyncOutlined />}
                        size={isMobile ? "small" : "middle"}
                        onClick={() => openShareModal(cat)}
                      />
                    </Col>
                  )}
                </Row>
                {/* Modal para compartir */}
                <Modal
                  title="Compartir imagen de gato"
                  visible={shareModalVisible}
                  onCancel={() => setShareModalVisible(false)}
                  footer={[
                    <Button key="cancel" onClick={() => setShareModalVisible(false)}>
                      Cancelar
                    </Button>,
                    <Button
                      key="share"
                      type="primary"
                      loading={shareLoading}
                      onClick={handleShare}
                      style={{ backgroundColor: '#FFC857', borderColor: '#FFC857', color: '#09555B' }}
                    >
                      Compartir
                    </Button>,
                  ]}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ marginBottom: '8px' }}>Selecciona un amigo:</p>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Buscar amigo..."
                      onChange={setSelectedFriend}
                      value={selectedFriend}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {friends.map(friend => (
                        <Option key={friend} value={friend}>
                          {friend.split('@')[0]}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ marginBottom: '8px' }}>Mensaje (opcional):</p>
                    <Input.TextArea
                      placeholder="Añade un mensaje..."
                      value={textEdit}
                      onChange={(e) => setTextEdit(e.target.value)}
                      rows={3}
                    />
                  </div>
                </Modal>

              </Card>
            </Col>
          );
        })}
      </Row>

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          Cargando más gatos...
        </div>
      )}

      {!loading && favoriteCats.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#09555B' }}>
          No tienes gatos favoritos aún
        </div>
      )}
    </Col>
  );
};

export default LoveCats;