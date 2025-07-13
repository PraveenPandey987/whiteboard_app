
import { io } from 'socket.io-client';
const apiUrl = import.meta.env.VITE_API_URL;
let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io(`${apiUrl}`, {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return socket;
};

export const getSocket = () => socket;
