import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, StatusBar as RNStatusBar, TouchableOpacity } from 'react-native';
import { Plus, BookOpen, ChevronRight } from 'lucide-react-native';
import { useRoom } from '../../context/RoomContext';
import { RoomCard } from '../../components/RoomCard';
import { theme } from '../../shared/theme';
import { CreateRoomModal } from './CreateRoomModal';
import { socketService } from '../../services/socketService';
import { QuranReader } from '../quran/QuranReader';

export const RoomsList: React.FC = () => {
  const { rooms, isLoading, currentRoom, setCurrentRoom } = useRoom();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);

  const handleCreateRoom = (roomName: string, userName: string) => {
    // This connects to the original logic you requested
    // Currently emitting a standard Create Room event setup. Wait for room-joined event to enter room typically.
    const socket = socketService.getSocket();
    if (socket) {
      // Pass author and room name based on web logic pattern
      socket.emit('create-room', { name: roomName, author: userName });
      // We can also create a dummy room and join immediately if backend takes a moment
      setCurrentRoom({
        id: Math.random().toString(), // Dummy ID until actual setup happens
        name: roomName,
        description: `أنشأها ${userName}`,
        speakerCount: 1,
        isActive: true
      });
    }
  };

  if (currentRoom || isReadingMode) {
    return (
      <SafeAreaView style={styles.container}>
        <RNStatusBar barStyle="dark-content" />
        {/* Back button only if they manually opened Mushaf without joining a room */}
        {!currentRoom && (
          <TouchableOpacity onPress={() => setIsReadingMode(false)} style={styles.backButton}>
            <ChevronRight color={theme.colors.text} size={32} />
          </TouchableOpacity>
        )}
        <QuranReader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <RNStatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Quran Voice Rooms</Text>
            <Text style={styles.headerSubtitle}>Real-time recitations and discussions</Text>
          </View>
          <TouchableOpacity onPress={() => setIsReadingMode(true)} style={styles.mushafBtn}>
            <BookOpen size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard
            name={item.name}
            description={item.description}
            speakerCount={item.speakerCount}
            onPress={() => setCurrentRoom(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No live rooms at the moment</Text>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsCreateModalVisible(true)}
      >
        <Plus color="#FFF" size={28} />
      </TouchableOpacity>

      <CreateRoomModal 
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateRoom}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mushafBtn: {
    padding: 12,
    backgroundColor: 'rgba(19, 78, 74, 0.1)',
    borderRadius: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  loadingText: {
    fontSize: 16,

    color: theme.colors.textSecondary,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});
