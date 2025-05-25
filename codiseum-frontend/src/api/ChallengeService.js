import axios from "axios";
import env from "../env";

const api = axios.create({
  baseURL: `${env.BACKEND_URL}/api/challenges`,
  withCredentials: true,
});

// Obtener todos los challenges (ADMIN)
export const getAllChallenges = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

// Obtener challenge por ID (ADMIN)
export const getChallengeById = async (id) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// Crear un nuevo challenge (ADMIN)
export const createChallenge = async (formData) => {
  try {
    const response = await api.post('/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// Actualizar un challenge existente (ADMIN)
export const updateChallenge = async (id, formData) => {
  try {
    const response = await api.put(`/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// Eliminar un challenge (ADMIN)
export const deleteChallenge = async (id) => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    handleError(error);
  }
};

// Obtener la imagen de un challenge (USER o ADMIN)
export const getChallengeImage = async (id) => {
  try {
    const response = await api.get(`/image/${id}`, {
      responseType: 'blob', 
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    handleError(error);
    return null;
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
  getAllChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getChallengeImage,
};