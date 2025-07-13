
import { io } from 'socket.io-client';

let socket;

export const initSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
  }
  return socket;
};

export const getSocket = () => socket;
