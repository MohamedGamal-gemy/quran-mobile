import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { theme } from '../../shared/theme';

interface CreateRoomModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (roomName: string, userName: string) => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ visible, onClose, onSubmit }) => {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmit = () => {
    if (roomName.trim() && userName.trim()) {
      onSubmit(roomName.trim(), userName.trim());
      setRoomName('');
      setUserName('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>إنشاء غرفة جديدة</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>اسمك (القارئ)</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: أحمد"
            placeholderTextColor={theme.colors.textSecondary}
            value={userName}
            onChangeText={setUserName}
            textAlign="right"
          />

          <Text style={styles.label}>اسم الغرفة (السورة)</Text>
          <TextInput
            style={styles.input}
            placeholder="مثال: تلاوة سورة البقرة"
            placeholderTextColor={theme.colors.textSecondary}
            value={roomName}
            onChangeText={setRoomName}
            textAlign="right"
          />

          <TouchableOpacity 
            style={[styles.submitButton, (!roomName.trim() || !userName.trim()) && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={!roomName.trim() || !userName.trim()}
          >
            <Text style={styles.submitButtonText}>إنشاء وانضمام</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  label: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    marginTop: 12,
    textAlign: 'right',
    fontFamily: theme.fonts.regular,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    fontFamily: theme.fonts.regular,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: theme.fonts.bold,
  },
});
