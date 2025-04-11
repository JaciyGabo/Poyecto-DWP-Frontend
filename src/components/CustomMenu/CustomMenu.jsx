import { Menu, Modal, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateUserProfile, getUserData } from "../../api/api";

const CustomMenu = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: ""
  });
  const [fetchingData, setFetchingData] = useState(false);

  const showModal = async () => {
    setIsModalVisible(true);
    setFetchingData(true);
    
    try {
      const data = await getUserData();
      setUserData({
        email: data.email || "",
        username: data.username || "",
        password: ""
      });
      
      form.setFieldsValue({
        username: data.username || "",
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      message.error(error.message || "Error al cargar datos del usuario");
    } finally {
      setFetchingData(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await updateUserProfile({
        username: values.username,
        password: values.password || undefined
      });
      
      message.success("Perfil actualizado correctamente");
      setUserData(prev => ({...prev, username: values.username}));
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      message.error(error.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Menu style={{ width: 200, background: "#28979f" }}>
        <Menu.Item
          key="profile"
          style={{ color: "white", fontSize: "20px", textAlign: "center" }}
          onClick={showModal}
        >
          Mi perfil
        </Menu.Item>

        <Menu.Item
          key="logout"
          style={{ color: "white", fontSize: "20px", textAlign: "center" }}
          onClick={() => navigate("/login")}
        >
          Cerrar sesión
        </Menu.Item>
      </Menu>

      <Modal
        title="Mi Perfil"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancelar
          </Button>,
          <Button 
            key="update" 
            type="primary" 
            loading={loading}
            onClick={handleUpdate}
            disabled={fetchingData}
          >
            Actualizar
          </Button>,
        ]}
      >
        {fetchingData ? (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            Cargando datos del usuario...
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item label="Correo electrónico">
              <Input value={userData.email} disabled />
            </Form.Item>
            
            <Form.Item
              name="username"
              label="Nombre de usuario"
              rules={[
                { required: true, message: 'Por favor ingresa tu nombre de usuario' },
                { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Nueva contraseña"
              rules={[
                { min: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              ]}
            >
              <Input.Password placeholder="Dejar en blanco para no cambiar" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirmar nueva contraseña"
              dependencies={['password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Las contraseñas no coinciden'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default CustomMenu;