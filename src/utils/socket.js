import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_URL 

const socket = io(URL, {
  transports: ['websocket', 'polling'],  // Allow polling fallback for Cloud Run
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: true,                // Important for Cloud Run instance changes
  path: '/socket.io/',          // Make sure this matches your Cloud Run setup
  secure: true,
  rejectUnauthorized: false,    // For Cloud Run's SSL
  pingInterval: 10000,          // More frequent pings for Cloud Run
  pingTimeout: 5000,
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err);
});

export default socket