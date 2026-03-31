import { useQuery } from '@tanstack/react-query';

const BASE_URL = 'https://api.quran.com/api/v4';

export interface Chapter {
  id: number;
  revelation_place: string;
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
}

export interface Verse {
  id: number;
  verse_key: string;
  text_uthmani: string;
}

export const fetchChapters = async (): Promise<Chapter[]> => {
  const response = await fetch(`${BASE_URL}/chapters?language=ar`);
  if (!response.ok) throw new Error('Failed to fetch chapters');
  const data = await response.json();
  return data.chapters;
};

export const fetchVersesByChapter = async (chapterId: number): Promise<Verse[]> => {
  // Using the text_uthmani endpoint which returns plain text Uthmani script for each verse
  const response = await fetch(`${BASE_URL}/quran/verses/uthmani?chapter_number=${chapterId}`);
  if (!response.ok) throw new Error('Failed to fetch verses');
  const data = await response.json();
  return data.verses;
};

// Hooks
export const useChapters = () => {
  return useQuery({
    queryKey: ['chapters'],
    queryFn: fetchChapters,
    staleTime: Infinity, // Chapters rarely change
  });
};

export const useVerses = (chapterId: number | null) => {
  return useQuery({
    queryKey: ['verses', chapterId],
    queryFn: () => fetchVersesByChapter(chapterId!),
    enabled: !!chapterId,
    staleTime: Infinity,
  });
};

export const fetchTafsirByAyah = async (verseKey: string, tafsirId: number = 16) => {
  const response = await fetch(`${BASE_URL}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
  if (!response.ok) throw new Error('Failed to fetch tafsir');
  const data = await response.json();
  return data.tafsir; // Contains { text: string }
};

export const useTafsir = (verseKey: string | null, tafsirId: number = 16) => {
  return useQuery({
    queryKey: ['tafsir', verseKey, tafsirId],
    queryFn: () => fetchTafsirByAyah(verseKey!, tafsirId),
    enabled: !!verseKey,
  });
};
