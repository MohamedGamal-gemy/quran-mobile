import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Mic, MicOff, PhoneOff, Users } from 'lucide-react-native';
import { useRoom } from '../../context/RoomContext';
import { useAudio } from '../../context/AudioContext';
import { theme } from '../../shared/theme';

export const VoiceRoomOverlay: React.FC = () => {
  const { currentRoom, setCurrentRoom } = useRoom();
  const { audioState, joinRoom, leaveRoom, toggleMute } = useAudio();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['15%', '40%', '90%'], []);

  useEffect(() => {
    if (currentRoom && !audioState.isJoined) {
      // Join the channel when room is selected
      joinRoom(currentRoom.id, Math.floor(Math.random() * 10000));
    }
  }, [currentRoom]);

  const handleClose = useCallback(() => {
    leaveRoom();
    setCurrentRoom(null);
  }, [leaveRoom, setCurrentRoom]);

  if (!currentRoom) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={handleClose}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.roomName}>{currentRoom.name}</Text>
          <View style={styles.activeBadge}>
            <View style={styles.pulse} />
            <Text style={styles.activeText}>Live</Text>
          </View>
        </View>

        <Text style={styles.description}>{currentRoom.description}</Text>

        <View style={styles.speakersGrid}>
          {/* Placeholder for active speakers list */}
          <View style={styles.speakerItem}>
            <View style={[styles.avatar, styles.activeAvatar]}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <Text style={styles.speakerName}>You (Host)</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, audioState.isMuted && styles.mutedBtn]}
            onPress={toggleMute}
          >
            {audioState.isMuted ? (
              <MicOff size={24} color={theme.colors.surface} />
            ) : (
              <Mic size={24} color={theme.colors.surface} />
            )}
            <Text style={styles.controlText}>{audioState.isMuted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.controlBtn, styles.leaveBtn]} onPress={handleClose}>
            <PhoneOff size={24} color={theme.colors.surface} />
            <Text style={styles.controlText}>Leave</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  indicator: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    width: 60,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roomName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.success,
  },
  activeText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 30,
  },
  speakersGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  speakerItem: {
    alignItems: 'center',
    width: 80,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeAvatar: {
    borderColor: theme.colors.primary,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  speakerName: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: 8,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 'auto',
  },
  controlBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  mutedBtn: {
    backgroundColor: theme.colors.textSecondary,
    shadowColor: theme.colors.textSecondary,
  },
  leaveBtn: {
    backgroundColor: theme.colors.danger,
    shadowColor: theme.colors.danger,
  },
  controlText: {
    color: theme.colors.surface,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
