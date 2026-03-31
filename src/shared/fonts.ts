import * as Font from 'expo-font';

export const loadFonts = () => {
  return Font.loadAsync({
    'Me Quran': require('../../assets/fonts/me_quran.ttf'), // Real path to Mushaf font
    'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
  });
};
