import axios from "axios";
import env from "../env";

const api = axios.create({
    baseURL: `${env.BACKEND_URL}/api/users`,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => config,
    (error) => {
        if (error.message.includes('Network Error')) {
            return Promise.resolve({ data: null });
        }
        return Promise.reject(error);
    }
);

// Obtener los datos del usuario autenticado
export const getCurrentUser = async () => {
    try {
        const response = await api.get('/me');
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

// Obtener los usuarios top
export const getTopUsers = async () => {
    try {
        const response = await api.get('/top');
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

// Obtener todos los usuarios (ADMIN)
export const getAllUsers = async () => {
    try {
        const response = await api.get('/');
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

// Obtener usuario por id (ADMIN)
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

// Actualizar username de un usuario (ADMIN)
export const updateUserById = async (id, updateUserDTO) => {
    try {
        const response = await api.put(`/${id}`, updateUserDTO);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

// Eliminar usuario (ADMIN)
export const deleteUserById = async (id) => {
    try {
        await api.delete(`/${id}`);
    } catch (error) {
        handleError(error);
    }
};

// Eliminar el usuario autenticado (USER o ADMIN)
export const deleteCurrentUser = async () => {
    try {
        await api.delete('/delete/me');
    } catch (error) {
        handleError(error);
    }
};

// Banear usuario (ADMIN)
export const banUserById = async (id) => {
    try {
        const response = await api.put(`/${id}/ban`);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

// Desbanear usuario (ADMIN)
export const unbanUserById = async (id) => {
    try {
        const response = await api.put(`/${id}/unban`);
        return response.data;
    } catch (error) {
        handleError(error);
        return null;
    }
};

// Manejo centralizado de errores
const handleError = (error) => {
    if (!error.response && !error.message.includes('Network Error')) {
        console.error('Error:', error.message);
    }
};

export default {
    getCurrentUser,
    getTopUsers,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    deleteCurrentUser,
    banUserById,
    unbanUserById,
};