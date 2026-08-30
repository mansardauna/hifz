export interface LiveAyah {
  number: number;
  numberInSurah: number;
  juz: number;
  text: string;
  translation: string;
  audioUrl?: string;
}

export interface LiveSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: LiveAyah[];
}

export const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', sub: 'مشاري راشد العفاسي' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', sub: 'محمود خليل الحصري' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', sub: 'محمد صديق المنشاوي' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit Murattal', sub: 'عبد الباسط عبد الصمد' },
];

/**
 * Fetches real Quran Surah with Arabic text, English translation, and live recitation audio from AlQuran Cloud API
 */
export async function fetchLiveSurah(
  surahNumber: number,
  reciterId = 'ar.alafasy'
): Promise<LiveSurah | null> {
  try {
    const res = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih,${reciterId}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch surah: ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.data || data.data.length < 3) {
      throw new Error('Incomplete data response from Quran API');
    }

    const uthmaniEdition = data.data[0];
    const translationEdition = data.data[1];
    const audioEdition = data.data[2];

    const ayahs: LiveAyah[] = uthmaniEdition.ayahs.map((ayah: any, idx: number) => {
      const translation = translationEdition.ayahs[idx]?.text || '';
      const audioUrl = audioEdition.ayahs[idx]?.audio || '';

      return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        text: ayah.text,
        translation,
        audioUrl,
      };
    });

    return {
      number: uthmaniEdition.number,
      name: uthmaniEdition.name,
      englishName: uthmaniEdition.englishName,
      englishNameTranslation: uthmaniEdition.englishNameTranslation,
      revelationType: uthmaniEdition.revelationType,
      numberOfAyahs: uthmaniEdition.numberOfAyahs,
      ayahs,
    };
  } catch (error) {
    console.error('Quran API fetch error:', error);
    return null;
  }
}

/**
 * Fetches the master list of all 114 Surahs
 */
export async function fetchAllSurahsList(): Promise<
  { number: number; name: string; englishName: string; englishNameTranslation: string; numberOfAyahs: number; revelationType: string }[]
> {
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch surah list:', error);
    return [];
  }
}
