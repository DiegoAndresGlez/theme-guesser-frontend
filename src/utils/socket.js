import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const socket = io(URL, {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 5, // Max reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts (in ms)
    reconnectionDelayMax: 5000, // Max delay between reconnection attempts
    //maybe add
        //query: ???
});

socket.on("connect", () => {
  console.log(`Connected to server:`, socket.id);
});

socket.on("connect-error", (error) => {
  console.error("Connection error:", error);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});

export default socket