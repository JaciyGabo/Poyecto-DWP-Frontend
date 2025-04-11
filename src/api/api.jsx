import axios from "axios";

const API_BASE_URL = "https://prrsaga-backend.onrender.com";
//const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    // Obtener el token de autenticación del almacenamiento local
    const token = localStorage.getItem("token");
    
    // Si existe un token, agregarlo a las cabeceras de la solicitud
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    // Opcional: Añadir timestamp para prevenir caché en solicitudes GET
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      };
    }
    
    return config;
  },
  (error) => {
    console.error("Error en la solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message ||
      error.message ||
      "Error en la solicitud";
    console.error("Error en la API:", errorMessage);
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al registrar usuario" };
  }
}

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al iniciar sesión" };
  }
}

export const verifyEmail = async (email) => {
  try {
    const response = await api.post("/verify-email", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al verificar el email" };
  }
}

export const verifyToken = async (email, token) => {
  try {
    const response = await api.post("/verify-token", { email, token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Error al verificar el token" };
  }
}

export const updatePassword = async (email, newPassword) => {
  try {
    const response = await api.post(`/update-pass`, {
      email,
      pass: newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Error updating password:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Error al actualizar la contraseña' };
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/logout");

    // Limpiar el token del frontend
    localStorage.removeItem("token");

    return response.data;
  } catch (error) {
    // Si hay error, limpiar el token de todas formas
    localStorage.removeItem("token");

    throw error.response?.data || {
      message: "Error al cerrar sesión"
    };
  }
};

export const saveFavoriteImage = async (imageUrl, text, hash) => {
  try {
    const response = await api.post('/save-favorite', { imageUrl, text, hash });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al guardar favorito' };
  }
};

export const removeFavorite = async (favoriteId) => {
  try {
    if (!favoriteId) throw new Error("El ID del favorito es inválido");
    
    const response = await api.delete(`/remove-favorite/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error("Error in removeFavorite:", error);
    throw error.response?.data || error.message || { message: "Error al eliminar favorito" };
  }
};

export const sendFriendRequest = async (email) => {
  try {
    const response = await api.post('/add-friend', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al enviar solicitud de amistad' };
  }
}

export const getFriendRequests = async () => {
  try {
    const response = await api.get('/friend-requests');
    return response.data;
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error.response?.data || { message: 'Error al obtener solicitudes' };
  }
};

export const acceptFriendRequest = async (fromUser) => {
  try {
    const response = await api.post('/accept-request', { fromUser });
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error.response?.data || { message: 'Error al aceptar solicitud' };
  }
};

export const getFriendsList = async () => {
  try {
    const response = await api.get('/friends');
    return response.data?.friends || [];
  } catch (error) {
    console.error('Error getting friends list:', error);
    throw error.response?.data || { message: 'Error al obtener lista de amigos' };
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.post('/update-profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response?.data || { message: 'Error al actualizar perfil' };
  }
}

// En tu archivo api/api.js
export const getUserData = async () => {
  try {
    const response = await api.get('/user-data');
    return response.data?.userData || {};
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error.response?.data || { message: 'Error al obtener datos del usuario' };
  }
};

export const shareCatPhoto = async (toUser, photoUrl, text = '') => {
  try {
    const response = await api.post('/share-photo', { toUser, photoUrl, text });
    return response.data;
  } catch (error) {
    console.error('Error sharing photo:', error);
    throw error.response?.data || { message: 'Error al compartir foto' };
  }
};

export const getSharedCats = async () => {
  try {
    const response = await api.get('/my-cats');
    return response.data.sharedPhotos || [];
  } catch (error) {
    console.error('Error getting shared cats:', error);
    throw error.response?.data || { message: 'Error al obtener gatos compartidos' };
  }
};

export const getFavoriteCats = async (lastVisible = null) => {
  try {
    const params = lastVisible ? { lastVisible } : {};
    const response = await api.get('/favorite-cats', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting favorite cats:', error);
    throw error.response?.data || { message: 'Error al obtener gatos favoritos' };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al verificar OTP' };
  }
}

export default saveFavoriteImage;