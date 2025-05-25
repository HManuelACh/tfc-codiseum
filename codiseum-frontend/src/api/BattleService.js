import axios from "axios";
import env from "../env";

const api = axios.create({
  baseURL: `${env.BACKEND_URL}/api/battles`,
  withCredentials: true,
});

// Obtener todas las batallas (ADMIN)
export const getAllBattles = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// Obtener batalla por ID (ADMIN)
export const getBattleById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// Obtener batallas por ID de usuario (ADMIN)
export const getBattlesByUserId = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// Manejo centralizado de errores
const handleError = (error) => {
  if (error.response) {
    console.error(`Error ${error.response.status}: ${error.response.data.message || error.response.statusText}`);
  } else {
    console.error("Error desconocido:", error.message || error);
  }
};

export default {
  getAllBattles,
  getBattleById,
  getBattlesByUserId,
};