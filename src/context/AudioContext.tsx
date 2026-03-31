import React, { createContext, useContext, useState } from 'react';
import { agoraService } from '../services/agoraService';

interface AudioState {
  isMuted: boolean;
  activeSpeakers: number[];
  isJoined: boolean;
}

interface AudioContextType {
  audioState: AudioState;
  joinRoom: (channelName: string, uid: number) => Promise<void>;
  leaveRoom: () => Promise<void>;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioState>({
    isMuted: false,
    activeSpeakers: [],
    isJoined: false,
  });

  const joinRoom = async (channelName: string, uid: number) => {
    await agoraService.joinChannel(channelName, uid);
    setAudioState(prev => ({ ...prev, isJoined: true }));
  };

  const leaveRoom = async () => {
    await agoraService.leaveChannel();
    setAudioState(prev => ({ ...prev, isJoined: false }));
  };

  const toggleMute = () => {
    const nextMuted = !audioState.isMuted;
    agoraService.muteLocalAudio(nextMuted);
    setAudioState(prev => ({ ...prev, isMuted: nextMuted }));
  };

  return (
    <AudioContext.Provider value={{ audioState, joinRoom, leaveRoom, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
