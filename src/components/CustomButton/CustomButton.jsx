const CustomButton = ({ onClick, text }) => {
    return (
      <button
        style={{
          backgroundColor: "#09555B",
          color: "white",
          border: "1px solid white",
          padding: "12px 30px",
          fontSize: "1.2rem",
          margin: "10px",
          cursor: "pointer",
          borderRadius: "5px",
          width: "200px",
        }}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };
  
  export default CustomButton;
  