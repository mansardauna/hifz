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

export const TOTAL_MUSHAF_PAGES = 604;

// Authentic King Fahd Complex Medina Mushaf: First page for each of the 30 Juz
export const JUZ_START_PAGES: Record<number, number> = {
  1: 1,
  2: 22,
  3: 42,
  4: 62,
  5: 82,
  6: 102,
  7: 121,
  8: 142,
  9: 162,
  10: 182,
  11: 201,
  12: 222,
  13: 242,
  14: 262,
  15: 282,
  16: 302,
  17: 322,
  18: 342,
  19: 362,
  20: 382,
  21: 402,
  22: 422,
  23: 442,
  24: 462,
  25: 482,
  26: 502,
  27: 522,
  28: 542,
  29: 562,
  30: 582,
};

export interface LiveMushafPageAyah {
  number: number;
  numberInSurah: number;
  juz: number;
  page: number;
  text: string;
  translation: string;
  audioUrl?: string;
  isFirstInSurah?: boolean;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

export interface LiveMushafPage {
  pageNumber: number;
  juz: number;
  surahs: {
    number: number;
    name: string;
    englishName: string;
    revelationType: string;
  }[];
  ayahs: LiveMushafPageAyah[];
}

const PAGE_CACHE = new Map<string, LiveMushafPage>();

/**
 * Fetches an authentic single page from the 604-page Medina Mushaf
 * with full Uthmani calligraphy, Sahih English translation, and verified reciter audio
 */
export async function fetchMedinaMushafPage(
  pageNumber: number,
  reciterId = 'ar.alafasy'
): Promise<LiveMushafPage | null> {
  const boundedPage = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, pageNumber));
  const cacheKey = `page_${boundedPage}_${reciterId}`;

  if (PAGE_CACHE.has(cacheKey)) {
    return PAGE_CACHE.get(cacheKey)!;
  }

  try {
    const [uthmaniRes, translationRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/page/${boundedPage}/quran-uthmani`),
      fetch(`https://api.alquran.cloud/v1/page/${boundedPage}/en.sahih`),
    ]);

    if (!uthmaniRes.ok) {
      throw new Error(`Failed to load page ${boundedPage} from Quran API`);
    }

    const uthmaniData = await uthmaniRes.json();
    const translationData = translationRes.ok ? await translationRes.json() : null;

    if (!uthmaniData.data || !uthmaniData.data.ayahs) {
      throw new Error('Invalid page payload structure from Quran API');
    }

    const rawAyahs = uthmaniData.data.ayahs;
    const transAyahs = translationData?.data?.ayahs || [];

    const surahsMap = new Map<number, { number: number; name: string; englishName: string; revelationType: string }>();

    const mappedAyahs: LiveMushafPageAyah[] = rawAyahs.map((ayah: any, idx: number) => {
      const transText = transAyahs[idx]?.text || '';
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${reciterId}/${ayah.number}.mp3`;
      const isFirstInSurah = ayah.numberInSurah === 1;

      if (!surahsMap.has(ayah.surah.number)) {
        surahsMap.set(ayah.surah.number, {
          number: ayah.surah.number,
          name: ayah.surah.name,
          englishName: ayah.surah.englishName,
          revelationType: ayah.surah.revelationType || 'Meccan',
        });
      }

      return {
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        juz: ayah.juz,
        page: ayah.page || boundedPage,
        text: ayah.text,
        translation: transText,
        audioUrl,
        isFirstInSurah,
        surah: {
          number: ayah.surah.number,
          name: ayah.surah.name,
          englishName: ayah.surah.englishName,
          englishNameTranslation: ayah.surah.englishNameTranslation || '',
          revelationType: ayah.surah.revelationType || 'Meccan',
          numberOfAyahs: ayah.surah.numberOfAyahs || 0,
        },
      };
    });

    const pageResult: LiveMushafPage = {
      pageNumber: boundedPage,
      juz: mappedAyahs[0]?.juz || 1,
      surahs: Array.from(surahsMap.values()),
      ayahs: mappedAyahs,
    };

    PAGE_CACHE.set(cacheKey, pageResult);

    // Preload next and previous pages in background for zero-latency page flips
    if (boundedPage < TOTAL_MUSHAF_PAGES && !PAGE_CACHE.has(`page_${boundedPage + 1}_${reciterId}`)) {
      setTimeout(() => {
        fetchMedinaMushafPage(boundedPage + 1, reciterId).catch(() => {});
      }, 500);
    }
    if (boundedPage > 1 && !PAGE_CACHE.has(`page_${boundedPage - 1}_${reciterId}`)) {
      setTimeout(() => {
        fetchMedinaMushafPage(boundedPage - 1, reciterId).catch(() => {});
      }, 700);
    }

    return pageResult;
  } catch (err) {
    console.error(`Error loading Medina Mushaf page ${boundedPage}:`, err);
    return null;
  }
}
