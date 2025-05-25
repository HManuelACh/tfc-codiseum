import axios from 'axios';
import UserService from './UserService';
import env from '../env';

const api = axios.create({
  baseURL: `${env.BACKEND_URL}/api/auth`,
  withCredentials: true,
});

export const isLogged = async () => {
  try {
    const userData = await UserService.getCurrentUser();
    return userData ? true : false;
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
};

export const isAdmin = async () => {
  try {
    const userData = await UserService.getCurrentUser();
    return userData && userData.role === "ROLE_ADMIN";
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

import { stopWebSocketReconnection } from '../ws/socketClient';

export const logout = async () => {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
  document.cookie = 'jwt_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  if (window.socketRef && window.socketRef.current) {
    window.socketRef.current.close();
    window.socketRef.current = null;
  }
  
  stopWebSocketReconnection();
};

export default {
  isLogged,
  isAdmin, 
  logout,
};