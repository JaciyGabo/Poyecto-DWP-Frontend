import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await api.post("/logout", null, config);

    // Limpiar el token del frontend
    localStorage.removeItem("token"); // o sessionStorage
    delete api.defaults.headers.common["Authorization"];

    return response.data;
  } catch (error) {
    // Si hay error, limpiar el token de todas formas
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];

    throw error.response?.data || {
      message: "Error al cerrar sesión"
    };
  }
};

export const saveFavoriteImage = async (imageUrl, text) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/save-favorite',
      { imageUrl, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al guardar favorito' };
  }
};

export const removeFavorite = async (favoriteId) => {
  try {
    if (!favoriteId) throw new Error("El ID del favorito es inválido");

    const token = localStorage.getItem("token");
    if (!token || token.length < 10) throw new Error("Token inválido");

    const response = await api.delete(`/remove-favorite/${favoriteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in removeFavorite:", error);
    throw error.response?.data || error.message || { message: "Error al eliminar favorito" };
  }
};

export const sendFriendRequest = async (email) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      '/add-friend',
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error al enviar solicitud de amistad' };
  }
}

export const getFriendRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para ver solicitudes');
    }

    const response = await api.get('/friend-requests', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting friend requests:', error);
    throw error.response?.data || { message: 'Error al obtener solicitudes' };
  }
};

export const acceptFriendRequest = async (fromUser) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para aceptar solicitudes');
    }

    const response = await api.post(
      '/accept-request',
      { fromUser },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error.response?.data || { message: 'Error al aceptar solicitud' };
  }
};

export const getFriendsList = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para ver tus amigos');
    }

    const response = await api.get('/friends', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Devuelve directamente response.data.friends o un array vacío si no existe
    return response.data?.friends || [];
  } catch (error) {
    console.error('Error getting friends list:', error);
    throw error.response?.data || { message: 'Error al obtener lista de amigos' };
  }
};

export const shareCatPhoto = async (toUser, photoUrl, text = '') => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para compartir fotos');
    }

    const response = await api.post(
      '/share-photo',
      { toUser, photoUrl, text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sharing photo:', error);
    throw error.response?.data || { message: 'Error al compartir foto' };
  }
};

export const getSharedCats = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para ver tus gatos compartidos');
    }

    const response = await api.get('/my-cats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    //console.log(response)
    return response.data.sharedPhotos || [];
  } catch (error) {
    console.error('Error getting shared cats:', error);
    throw error.response?.data || { message: 'Error al obtener gatos compartidos' };
  }
};

export const getFavoriteCats = async (lastVisible = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Debes iniciar sesión para ver tus favoritos');
    }

    const params = lastVisible ? { lastVisible } : {};
    const response = await api.get('/favorite-cats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params
    });

    //console.log("Gatos favoritos:", response.data);

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
