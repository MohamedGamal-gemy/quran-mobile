import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { RoomProvider } from './src/context/RoomContext';
import { AudioProvider } from './src/context/AudioContext';
import { RoomsList } from './src/features/rooms/RoomsList';
import { VoiceRoomOverlay } from './src/features/rooms/VoiceRoomOverlay';
import { theme } from './src/shared/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RoomProvider>
          <AudioProvider>
            <View style={styles.container}>
              <RoomsList />
              <VoiceRoomOverlay />
              <StatusBar style="auto" />
            </View>
          </AudioProvider>
        </RoomProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
