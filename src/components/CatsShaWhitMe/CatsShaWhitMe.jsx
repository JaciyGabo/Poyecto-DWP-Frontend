import { Card, Col, Avatar, Image as AntImage, message, Button } from "antd";
import { useState, useEffect } from "react";
import { getSharedCats } from '../../api/api';
import { DownloadOutlined } from "@ant-design/icons";

const CatsShaWithMe = ({ screenSize }) => {
  const { isMobile, isTablet } = screenSize || {
    isMobile: window.innerWidth <= 768,
    isTablet: window.innerWidth > 768 && window.innerWidth <= 992
  };

  const [sharedCats, setSharedCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);


  // Función para descargar la imagen y almacenarla como Blob
  const downloadImage = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error descargando imagen:", error);
      return "https://placekitten.com/200/200"; // Imagen de fallback
    }
  };

  const handleDownload = (imageUrl, catName) => {
    try {
      // Crear un elemento de imagen temporal para asegurar que la imagen está cargada
      const img = new Image();
      img.crossOrigin = "anonymous"; // Importante para evitar problemas CORS

      img.onload = () => {
        // Crear un canvas con las dimensiones de la imagen
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Establecer las dimensiones del canvas
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0);

        // Convertir el canvas a un blob
        canvas.toBlob((blob) => {
          // Crear una URL para el blob
          const url = URL.createObjectURL(blob);

          // Crear un enlace de descarga
          const link = document.createElement("a");
          link.href = url;
          link.download = `${catName || 'gato-compartido'}.jpg`;

          // Añadir el enlace al documento y hacer clic en él
          document.body.appendChild(link);
          link.click();

          // Eliminar el enlace y liberar la URL
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 100);

          message.success("Imagen descargada correctamente");
        }, "image/jpeg", 0.9); // Formato JPEG con 90% de calidad
      };

      img.onerror = () => {
        message.error("Error al cargar la imagen para descargar");
      };

      // Asignar la URL de la imagen
      img.src = imageUrl;

    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      message.error("No se pudo descargar la imagen");
    }
  };

  // Función para obtener los gatos compartidos
  useEffect(() => {
    const fetchSharedCats = async () => {
      try {
        const cats = await getSharedCats();
        //console.log("Datos recibidos del backend:", cats);

        const processedCats = await Promise.all(
          cats.map(async (cat) => {
            let createdAtDate;
            if (cat.createdAt?.toDate) {
              createdAtDate = cat.createdAt.toDate();
            } else if (cat.createdAt?._seconds) {
              createdAtDate = new Date(cat.createdAt._seconds * 1000);
            } else {
              createdAtDate = new Date();
            }

            // Descargar la imagen y convertirla en Blob URL
            const localImageUrl = await downloadImage(cat.photoUrl);

            return {
              id: cat.id,
              name: cat.fromUser.split("@")[0],
              color: getAvatarColor(cat.fromUser),
              image: localImageUrl, // Usamos la imagen local en lugar de la de la API
              catName: cat.text || "Gato sin nombre",
              fromUser: cat.fromUser,
              createdAt: createdAtDate
            };
          })
        );

        //console.log("Datos procesados:", processedCats);
        setSharedCats(processedCats);
      } catch (error) {
        console.error("Error fetching shared cats:", error);
        message.error(error.message || "Error al cargar gatos compartidos");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCats();
  }, []);

  // Función para generar color consistente desde el email
  const getAvatarColor = (email) => {
    const colors = ['#ff8c00', '#008000', '#ff4d4f', '#09555B', '#67AB9F'];
    const hash = email?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  // Ordenar por fecha (más recientes primero)
  const sortedCats = [...sharedCats].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <Col xs={24} sm={10} md={9} lg={8} xl={7} style={{ marginBottom: isMobile ? "16px" : 0 }}>
      <Card
        style={{
          backgroundColor: "#E2E9EE",
          borderRadius: "15px",
          padding: isMobile ? "10px" : "15px",
          height: "97%",
          display: "flex",
          flexDirection: "column"
        }}
        loading={loading}
      >
        <p style={{
          marginBottom: "10px",
          textAlign: "center",
          borderRadius: "10px",
          backgroundColor: "#09555B",
          border: "2px solid #BAC8D3",
          color: "white",
          fontSize: isMobile ? "14px" : "15px",
          padding: "5px",
          position: "sticky",
          top: 0,
          zIndex: 1,
          flexShrink: 0
        }}>
          Gatos compartidos conmigo
        </p>

        <div style={{
          flex: 1,
          overflowY: "auto",
          maxHeight: isMobile ? '40vh' : isTablet ? '50vh' : '60vh',
          padding: "0 5px",
          scrollbarWidth: "thin"
        }}>
          {sortedCats.length === 0 && !loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#09555B' }}>
              No tienes gatos compartidos aún
            </div>
          ) : (
            sortedCats.map((cat) => (
              <Card
                key={cat.id}
                style={{
                  marginBottom: "10px",
                  borderRadius: "15px",
                  backgroundColor: "#67AB9F",
                  padding: isMobile ? "8px" : "12px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
                }}
                bodyStyle={{
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  paddingBottom: "8px",
                  borderBottom: "1px dashed rgba(255, 200, 87, 0.5)"
                }}>
                  <Avatar size={isMobile ? 40 : 48} style={{ backgroundColor: cat.color }}>
                    {cat.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>

                  <span style={{
                    background: "#FFC857",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    fontSize: isMobile ? "13px" : "14px",
                    fontWeight: 500,
                    color: "#09555B",
                    flex: 1,
                    textAlign: "center"
                  }}>
                    {cat.name}
                  </span>
                </div>

                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "4px 0"
                }}>
                  <AntImage
                    src={cat.image}
                    alt={`Gato compartido por ${cat.name}`}
                    onClick={() => setPreviewVisible(true)}
                    onError={(e) => {
                      console.error("Error cargando imagen:", cat.image);
                      e.target.src = "https://placekitten.com/200/200";
                    }}
                    crossOrigin="anonymous"
                    style={{ marginBottom: "8px" }}
                  />
                  <div style={{
                  textAlign: "center",
                  background: "rgba(255, 200, 87)",
                  borderRadius: "6px",
                  border: "1px solid rgba(47, 33, 5, 0.5)",
                  padding: "4px 8px",
                  marginTop: "4px",
                  marginBottom: "8px",
                }}>
               <span style={{
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: 500,
                    color: "#09555B"
                  }}>
                    {cat.catName}
                  </span>   
                </div>

                  <Button
                    icon={<DownloadOutlined />}
                    size={isMobile ? "small" : "middle"}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que se active la vista previa
                      handleDownload(cat.image, cat.catName);
                    }}
                    style={{
                      backgroundColor: "#FFC857",
                      borderColor: "#09555B",
                      color: "#09555B"
                    }}
                  >
                    {isMobile ? "" : "Descargar"}
                  </Button>
                </div>

                
              </Card>
            ))
          )}
        </div>
      </Card>
    </Col>
  );
};

export default CatsShaWithMe;
