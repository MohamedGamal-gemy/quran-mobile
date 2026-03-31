import React, { createContext, useContext, useState, useEffect } from 'react';
import { socketService } from '../services/socketService';

interface Room {
  id: string;
  name: string;
  description: string;
  speakerCount: number;
  isActive: boolean;
}

interface RoomContextType {
  rooms: Room[];
  currentRoom: Room | null;
  setCurrentRoom: (room: Room | null) => void;
  isLoading: boolean;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = socketService.connect();
    
    socket?.on('rooms-update', (updatedRooms: Room[]) => {
      setRooms(updatedRooms);
      setIsLoading(false);
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  return (
    <RoomContext.Provider value={{ rooms, currentRoom, setCurrentRoom, isLoading }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
};
