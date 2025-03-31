import { useState, useEffect } from "react";
import { Card, Spin } from "antd";

const DatosCuriosos = () => {
  const [fact, setFact] = useState("Cargando datos curiosos...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Conectar con el servidor SSE
    const eventSource = new EventSource("http://localhost:3000/events");

    eventSource.onmessage = (event) => {
      setFact(event.data);
      setLoading(false);
    };

    eventSource.onerror = (error) => {
      console.error("Error en SSE:", error);
      setFact("Error al cargar datos.");
      setLoading(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <Card
      style={{
        backgroundColor: "#E2E9EE",
        borderRadius: "20px",
        padding: "16px",
        height: "100%",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <h2
        style={{
          color: "#09555B",
          fontSize: "clamp(28px, 5vw, 45px)",
          textAlign: "center",
          margin: "0 0 16px 0",
        }}
      >
        ¿Sabías qué?
      </h2>
      {loading ? (
        <Spin size="large" />
      ) : (
        <p
          style={{
            color: "#09555B",
            fontSize: "clamp(16px, 3vw, 20px)",
          }}
        >
          {fact}
        </p>
      )}
    </Card>
  );
};

export default DatosCuriosos;
