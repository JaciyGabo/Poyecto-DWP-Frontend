import { Card, Input, Button, message, Modal, Select } from 'antd';
import { DownloadOutlined, SyncOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import { saveFavoriteImage, shareCatPhoto, getFriendsList } from '../../api/api';

const { Option } = Select;

const GenerateCats = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [text, setText] = useState('');
  const [textEdit, setTextEdit] = useState('');
  const [imageUrl, setImageUrl] = useState('https://cataas.com/cat/says/Hola c:?fontSize=60&fontColor=red');
  const imgRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);


  useEffect(() => {
    // Cargar amigos desde la API al montar el componente
    const loadFriends = async () => {
      try {
        const friendsList = await getFriendsList();
        setFriends(friendsList);
      } catch (error) {
        console.error('Error fetching friends:', error);
        message.error(error.message || 'Error al cargar amigos');
      }
    };

    loadFriends();
  }, []);

  useEffect(() => {
    // Verifica si la imagen actual está en favoritos
    const isLiked = favorites.some(fav => fav.url === imageUrl);
    console.log("isLiked", isLiked)
    setLiked(isLiked);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [imageUrl, favorites]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("catFavorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const generateImage = () => {
    const timestamp = new Date().getTime();
    if (text.trim()) {
      setImageUrl(`https://cataas.com/cat/says/${encodeURIComponent(text)}?fontSize=60&fontColor=red&t=${timestamp}`);
    } else {
      setImageUrl(`https://cataas.com/cat/says/Hola c:?fontSize=60&fontColor=red&t=${timestamp}`);
    }
  };

  const handleShare = async () => {
    if (!selectedFriend) {
      message.warning('Por favor selecciona un amigo');
      return;
    }

    setShareLoading(true);
    try {
      await shareCatPhoto(selectedFriend, imageUrl, textEdit || 'Mira este gato!');
      message.success('Foto compartida exitosamente');
      setShareModalVisible(false);
      setSelectedFriend(null);
    } catch (error) {
      console.error("Error sharing photo:", error);
      message.error(error.message || "Error al compartir foto");
    } finally {
      setShareLoading(false);
    }
  };

  const openShareModal = () => {
    if (friends.length === 0) {
      message.warning('No tienes amigos para compartir');
      return;
    }
    setShareModalVisible(true);
  };

  // Función para descargar la imagen actual mostrada
  const downloadImage = () => {
    if (imgRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = imgRef.current.naturalWidth;
      canvas.height = imgRef.current.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgRef.current, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'cat-image.jpg';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 'image/jpeg');
    }
  };

  const handleLike = async () => {
    try {
      if (!imageUrl) {
        message.warning('No hay imagen para guardar como favorita');
        return;
      }

      // Si no está marcado como like, lo agregamos
      const response = await saveFavoriteImage(imageUrl, text || 'Imagen de gato');

      const newFavorite = {
        id: response.id || `local-${Math.random().toString(36).substr(2, 9)}`,
        url: imageUrl,
        text: text || 'Imagen de gato'
      };

      const updatedFavorites = [...favorites, newFavorite];
      setFavorites(updatedFavorites);
      setLiked(true);
      localStorage.setItem('catFavorites', JSON.stringify(updatedFavorites));
      message.success("Imagen guardada en favoritos");

    } catch (error) {
      message.error(error.message || 'Error al actualizar favoritos');
    }
  };

  return (
    <Card
      style={{ backgroundColor: '#E2E9EE', borderRadius: '25px', padding: '16px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '8px', marginBottom: '16px' }}>
        <Input
          placeholder="Escribe algo..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            borderRadius: '20px', textAlign: 'center', backgroundColor: '#09555B', border: "2px solid #BAC8D3", color: 'white', flex: 1,
            marginBottom: isMobile ? '8px' : '0',
          }}
        />
        <Button
          type="primary"
          onClick={generateImage}
          style={{ backgroundColor: '#FFC857', border: 'none', color: '#09555B', borderRadius: '10px', width: isMobile ? '100%' : 'auto' }}
        >
          Generar imagen
        </Button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', marginBottom: '16px' }}>
        <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          {imageUrl && (
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Generated"
              crossOrigin="anonymous"
              style={{ width: isMobile ? '70%' : '40%', maxWidth: '300px', borderRadius: '8px', margin: '0 auto', maxHeight: '30px' }}
              onError={(e) => {
                console.error('Error loading image:', e);
                e.target.src = 'https://cataas.com/cat?t=' + new Date().getTime();
              }}
            />
          )}
          <Button
            icon={!liked ? <HeartOutlined style={{ color: 'red', fontSize: "40px" }} /> : <HeartFilled style={{ color: 'red', fontSize: "40px" }} />}
            style={{ position: 'absolute', top: '8px', right: isMobile ? '15%' : '30%', backgroundColor: 'transparent', border: 'none' }}
            onClick={handleLike}
          />
        </div>

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
                {friend.split('@')[0]} {/* Muestra solo el nombre del email */}
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
        <div style={{ textAlign: 'center' }}>
        
        </div>
      </Modal>

      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '10px', flexWrap: 'wrap' }}>
        <Button icon={<DownloadOutlined />} onClick={downloadImage} style={{ minWidth: '40px', height: '40px' }} />
        <Button icon={<SyncOutlined />} onClick={openShareModal} style={{ minWidth: '40px', height: '40px' }} />
      </div>
    </Card>
  );
}

export default GenerateCats;
