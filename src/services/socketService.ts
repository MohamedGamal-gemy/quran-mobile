import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'https://quran-rooms-api.example.com'; // Placeholder, replace with actual backend URL
const SOCKET_URL = 'http://localhost:5000/api/rooms'; // Placeholder, replace with actual backend URL

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  joinRoom(roomId: string) {
    this.socket?.emit('join-room', roomId);
  }

  leaveRoom(roomId: string) {
    this.socket?.emit('leave-room', roomId);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
