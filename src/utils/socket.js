import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const socket = io(URL, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Max reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in ms)
    secure: true,
    //maybe add
        //query: ???
});

export const connectWithAuth = (playerInfo) => {
  // Set auth data before connecting
  socket.auth = { playerInfo: JSON.stringify(playerInfo) };
  socket.connect();
};

export default socket