import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, SafeAreaView } from 'react-native';
import { ChevronDown, X, BookOpen } from 'lucide-react-native';
import { useChapters, useVerses, useTafsir, Chapter, Verse } from '../../hooks/useQuran';
import { theme } from '../../shared/theme';

const TAFSIRS = [
  { id: 16, name: 'التفسير الميسر' },
  { id: 171, name: 'تفسير السعدي' },
  { id: 17, name: 'تفسير الجلالين' },
  { id: 169, name: 'ابن كثير (EN)' }
];

interface TafsirModalProps {
  verse: Verse | null;
  visible: boolean;
  onClose: () => void;
}

const TafsirModal: React.FC<TafsirModalProps> = ({ verse, visible, onClose }) => {
  const [selectedTafsirId, setSelectedTafsirId] = useState(16);
  const { data: tafsir, isLoading } = useTafsir(verse?.verse_key || null, selectedTafsirId);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>التفسير</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tafsirTabsScroll}>
            <View style={styles.tafsirTabsContainer}>
              {TAFSIRS.map(t => (
                <TouchableOpacity 
                  key={t.id} 
                  onPress={() => setSelectedTafsirId(t.id)}
                  style={[styles.tafsirTab, selectedTafsirId === t.id && styles.activeTafsirTab]}
                >
                  <Text style={[styles.tafsirTabText, selectedTafsirId === t.id && styles.activeTafsirTabText]}>
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {verse && (
            <View style={styles.ayahContainer}>
              <Text style={styles.ayahText}>{verse.text_uthmani} ﴿{toArabicNumerals(verse.verse_key.split(':')[1])}﴾</Text>
            </View>
          )}

          <ScrollView style={styles.tafsirScroll}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 20 }} />
            ) : (
              <Text style={styles.tafsirText}>
                {tafsir?.text?.replace(/<[^>]+>/g, '') || 'لا يوجد تفسير متاح لهذه الآية.'}
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const toArabicNumerals = (num: string | number) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/[0-9]/g, (w) => arabicNumbers[+w]);
};

interface QuranReaderProps {
  initialChapter?: number;
}

export const QuranReader: React.FC<QuranReaderProps> = ({ initialChapter = 1 }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(initialChapter);
  const [isChapterListVisible, setIsChapterListVisible] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  const { data: chapters, isLoading: isLoadingChapters } = useChapters();
  const { data: verses, isLoading: isLoadingVerses } = useVerses(selectedChapterId);

  const selectedChapter = chapters?.find(c => c.id === selectedChapterId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.chapterSelector} 
          onPress={() => setIsChapterListVisible(true)}
          disabled={isLoadingChapters}
        >
          <Text style={styles.chapterName}>
            {selectedChapter ? `سورة ${selectedChapter.name_arabic}` : 'جاري التحميل...'}
          </Text>
          <ChevronDown size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Chapters Dropdown Modal */}
      <Modal visible={isChapterListVisible} animationType="fade" transparent onRequestClose={() => setIsChapterListVisible(false)}>
        <View style={styles.dropdownOverlay}>
          <View style={styles.dropdownContent}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>اختر السورة</Text>
              <TouchableOpacity onPress={() => setIsChapterListVisible(false)}>
                <X size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={chapters}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.chapterItem, selectedChapterId === item.id && styles.activeChapterItem]}
                  onPress={() => {
                    setSelectedChapterId(item.id);
                    setIsChapterListVisible(false);
                  }}
                >
                  <View style={styles.chapterItemLeft}>
                    <View style={styles.chapterNumberBadge}>
                      <Text style={styles.chapterNumberText}>{item.id}</Text>
                    </View>
                    <Text style={[styles.chapterItemName, selectedChapterId === item.id && styles.activeChapterText]}>
                      سورة {item.name_arabic}
                    </Text>
                  </View>
                  <Text style={styles.chapterItemVerses}>{item.verses_count} آية</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Verses List */}
      <View style={styles.mushafContainer}>
        {isLoadingVerses ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.versesContainer} showsVerticalScrollIndicator={false}>
            {selectedChapter?.bismillah_pre && (
              <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
            )}
            <Text style={styles.mushafTextContainer}>
              {verses?.map((item) => (
                <Text 
                  key={item.id} 
                  style={styles.verseText} 
                  onPress={() => setSelectedVerse(item)}
                  suppressHighlighting
                >
                  {item.text_uthmani} <Text style={styles.ayahNumber}>﴿{toArabicNumerals(item.verse_key.split(':')[1])}﴾</Text>{' '}
                </Text>
              ))}
            </Text>
          </ScrollView>
        )}
      </View>

      <TafsirModal 
        verse={selectedVerse} 
        visible={!!selectedVerse} 
        onClose={() => setSelectedVerse(null)} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF5E9', // Mushaf-like very warm background
  },
  header: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#FAF5E9',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  chapterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chapterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  mushafContainer: {
    flex: 1,
  },
  versesContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  bismillah: {
    fontSize: 26,
    textAlign: 'center',
    color: '#1a1a1a',
    marginBottom: 30,
    marginTop: 10,
    fontFamily: theme.fonts.bold, // Needs traditional font if available
  },
  mushafTextContainer: {
    textAlign: 'center',
    lineHeight: 60,
    writingDirection: 'rtl',
  },
  verseText: {
    fontSize: 30, // Large for reading
    color: '#1a1a1a',
    fontFamily: theme.fonts.regular,
  },
  ayahNumber: {
    color: theme.colors.primary,
    fontSize: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  closeBtn: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
  },
  tafsirTabsScroll: {
    maxHeight: 40,
    marginBottom: 16,
  },
  tafsirTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingRight: 10,
  },
  tafsirTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  activeTafsirTab: {
    backgroundColor: theme.colors.primary,
  },
  tafsirTabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.bold,
  },
  activeTafsirTabText: {
    color: theme.colors.surface,
  },
  ayahContainer: {
    backgroundColor: '#FAF5E9',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  ayahText: {
    fontSize: 22,
    textAlign: 'right',
    color: '#1a1a1a',
    lineHeight: 40,
    fontFamily: theme.fonts.regular,
  },
  tafsirScroll: {
    flex: 1,
  },
  tafsirText: {
    fontSize: 18,
    textAlign: 'right',
    color: theme.colors.textSecondary,
    lineHeight: 32,
    fontFamily: theme.fonts.regular,
  },
  // Dropdown
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  dropdownContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    height: '80%',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  activeChapterItem: {
    backgroundColor: 'rgba(19, 78, 74, 0.05)', // light primary
  },
  chapterItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chapterNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  chapterItemName: {
    fontSize: 18,
    color: theme.colors.text,
    fontFamily: theme.fonts.bold,
  },
  activeChapterText: {
    color: theme.colors.primary,
  },
  chapterItemVerses: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
