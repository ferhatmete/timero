import 'intl-pluralrules';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  en: {
    translation: {
      work: 'Focus',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
      selectTheme: 'Select Theme',
      selectLanguage: 'Select Language',
      settings: 'Settings',
      preferences: 'Preferences',
      autoStart: 'Auto-start next cycle',
      autoStartDesc: 'Automatically starts the next session when current one ends',
      nextBreakType: 'Break type after focus',
      nextBreakTypeDesc: 'Choose which break to take after a focus session',
      shortBreakOption: 'Short Break (5 min)',
      shortBreakDesc: 'Quick refresh for sustained focus',
      longBreakOption: 'Long Break (15 min)',
      longBreakDesc: 'Extended rest for deeper recovery',
      language: 'Language',
      statistics: 'Statistics',
      today: 'Today',
      todaySessions: 'Sessions',
      todayMinutes: 'Focus Time',
      streaks: 'Streaks',
      currentStreak: 'Current',
      maxStreak: 'Best',
      day: 'day',
      days: 'days',
      allTime: 'All Time',
      totalSessionsAllTime: 'Total Sessions',
      totalFocusTime: 'Total Focus Time',
      bestHour: 'Most Productive Hour',
      congratulations: 'Congratulations!',
      pomodoroSetComplete: 'You completed a Pomodoro set! 🎉',
      notificationWorkComplete: 'Focus session completed! 🎯',
      notificationWorkCompleteBody: 'Great job! Time for a break.',
      notificationShortBreakComplete: 'Short break finished! ☕',
      notificationShortBreakCompleteBody: 'Ready to focus again?',
      notificationLongBreakComplete: 'Long break finished! 🌴',
      notificationLongBreakCompleteBody: 'Refreshed and ready to work!',
      themes: {
        space: 'Space',
        sea: 'Sea',
        coast: 'Coast',
        forest: 'Forest',
        desert: 'Desert',
        city: 'City',
        sunset: 'Sunset',
        mountain: 'Mountain',
        polar: 'Polar',
        night: 'Night',
      }
    },
  },
  tr: {
    translation: {
      work: 'Odak',
      shortBreak: 'Kısa Mola',
      longBreak: 'Uzun Mola',
      selectTheme: 'Tema Seç',
      selectLanguage: 'Dil Seç',
      settings: 'Ayarlar',
      preferences: 'Tercihler',
      autoStart: 'Sonraki döngüyü otomatik başlat',
      autoStartDesc: 'Mevcut oturum bittiğinde sonraki oturumu otomatik başlatır',
      nextBreakType: 'Odak sonrası mola türü',
      nextBreakTypeDesc: 'Odak oturumundan sonra hangi molayı alacağınızı seçin',
      shortBreakOption: 'Kısa Mola (5 dk)',
      shortBreakDesc: 'Sürekli odak için hızlı yenilenme',
      longBreakOption: 'Uzun Mola (15 dk)',
      longBreakDesc: 'Derin dinlenme için uzun ara',
      language: 'Dil',
      statistics: 'İstatistikler',
      today: 'Bugün',
      todaySessions: 'Oturum',
      todayMinutes: 'Odak Süresi',
      streaks: 'Seriler',
      currentStreak: 'Mevcut',
      maxStreak: 'Rekor',
      day: 'gün',
      days: 'gün',
      allTime: 'Tüm Zamanlar',
      totalSessionsAllTime: 'Toplam Oturum',
      totalFocusTime: 'Toplam Odak Süresi',
      bestHour: 'En Verimli Saat',
      congratulations: 'Tebrikler!',
      pomodoroSetComplete: '1 Pomodoro setini tamamladın! 🎉',
      notificationWorkComplete: 'Odak oturumu tamamlandı! 🎯',
      notificationWorkCompleteBody: 'Harika iş! Mola zamanı.',
      notificationShortBreakComplete: 'Kısa mola bitti! ☕',
      notificationShortBreakCompleteBody: 'Tekrar odaklanmaya hazır mısın?',
      notificationLongBreakComplete: 'Uzun mola bitti! 🌴',
      notificationLongBreakCompleteBody: 'Yenilendin ve çalışmaya hazırsın!',
      themes: {
        space: 'Uzay',
        sea: 'Deniz',
        coast: 'Kıyı',
        forest: 'Orman',
        desert: 'Çöl',
        city: 'Şehir',
        sunset: 'Gün Batımı',
        mountain: 'Dağ',
        polar: 'Kutup',
        night: 'Gece',
      }
    },
  },
  de: {
    translation: {
      work: 'Fokus',
      shortBreak: 'Kurze Pause',
      longBreak: 'Lange Pause',
      selectTheme: 'Thema Wählen',
      selectLanguage: 'Sprache Wählen',
      themes: {
        space: 'Weltraum',
        sea: 'Meer',
        coast: 'Küste',
        forest: 'Wald',
        desert: 'Wüste',
        city: 'Stadt',
        sunset: 'Sonnenuntergang',
        mountain: 'Berg',
        polar: 'Polar',
        night: 'Nacht',
      }
    },
  },
  es: {
    translation: {
      work: 'Enfoque',
      shortBreak: 'Descanso Corto',
      longBreak: 'Descanso Largo',
      selectTheme: 'Seleccionar Tema',
      selectLanguage: 'Seleccionar Idioma',
      themes: {
        space: 'Espacio',
        sea: 'Mar',
        coast: 'Costa',
        forest: 'Bosque',
        desert: 'Desierto',
        city: 'Ciudad',
        sunset: 'Atardecer',
        mountain: 'Montaña',
        polar: 'Polar',
        night: 'Noche',
      }
    },
  },
  fr: {
    translation: {
      work: 'Focus',
      shortBreak: 'Pause Courte',
      longBreak: 'Pause Longue',
      selectTheme: 'Choisir Thème',
      selectLanguage: 'Choisir la langue',
      themes: {
        space: 'Espace',
        sea: 'Mer',
        coast: 'Côte',
        forest: 'Forêt',
        desert: 'Désert',
        city: 'Ville',
        sunset: 'Coucher de soleil',
        mountain: 'Montagne',
        polar: 'Polaire',
        night: 'Nuit',
      }
    },
  },
  it: {
    translation: {
      work: 'Focus',
      shortBreak: 'Pausa Breve',
      longBreak: 'Pausa Lunga',
      selectTheme: 'Seleziona Tema',
      selectLanguage: 'Seleziona Lingua',
      themes: {
        space: 'Spazio',
        sea: 'Mare',
        coast: 'Costa',
        forest: 'Foresta',
        desert: 'Deserto',
        city: 'Città',
        sunset: 'Tramonto',
        mountain: 'Montagna',
        polar: 'Polare',
        night: 'Notte',
      }
    },
  },
  pt: {
    translation: {
      work: 'Foco',
      shortBreak: 'Pausa Curta',
      longBreak: 'Pausa Longa',
      selectTheme: 'Selecionar Tema',
      selectLanguage: 'Selecionar Idioma',
      themes: {
        space: 'Espaço',
        sea: 'Mar',
        coast: 'Costa',
        forest: 'Floresta',
        desert: 'Deserto',
        city: 'Cidade',
        sunset: 'Pôr do Sol',
        mountain: 'Montanha',
        polar: 'Polar',
        night: 'Noite',
      }
    },
  },
  ru: {
    translation: {
      work: 'Фокус',
      shortBreak: 'Короткий перерыв',
      longBreak: 'Длинный перерыв',
      selectTheme: 'Выбрать тему',
      selectLanguage: 'Выберите язык',
      themes: {
        space: 'Космос',
        sea: 'Море',
        coast: 'Побережье',
        forest: 'Лес',
        desert: 'Пустыня',
        city: 'Город',
        sunset: 'Закат',
        mountain: 'Гора',
        polar: 'Полярный',
        night: 'Ночь',
      }
    },
  },
  ja: {
    translation: {
      work: '集中',
      shortBreak: '短い休憩',
      longBreak: '長い休憩',
      selectTheme: 'テーマを選択',
      selectLanguage: '言語を選択',
      themes: {
        space: '宇宙',
        sea: '海',
        coast: '海岸',
        forest: '森',
        desert: '砂漠',
        city: '都市',
        sunset: '夕日',
        mountain: '山',
        polar: '極地',
        night: '夜',
      }
    },
  },
  zh: {
    translation: {
      work: '专注',
      shortBreak: '短休息',
      longBreak: '长休息',
      selectTheme: '选择主题',
      selectLanguage: '选择语言',
      themes: {
        space: '太空',
        sea: '海洋',
        coast: '海岸',
        forest: '森林',
        desert: '沙漠',
        city: '城市',
        sunset: '日落',
        mountain: '山脉',
        polar: '极地',
        night: '夜晚',
      }
    },
  },
  ko: {
    translation: {
      work: '집중',
      shortBreak: '짧은 휴식',
      longBreak: '긴 휴식',
      selectTheme: '테마 선택',
      selectLanguage: '언어 선택',
      themes: {
        space: '우주',
        sea: '바다',
        coast: '해안',
        forest: '숲',
        desert: '사막',
        city: '도시',
        sunset: '일몰',
        mountain: '산',
        polar: '극지',
        night: '밤',
      }
    },
  },
  ar: {
    translation: {
      work: 'التركيز',
      shortBreak: 'استراحة قصيرة',
      longBreak: 'استراحة طويلة',
      selectTheme: 'اختر الموضوع',
      selectLanguage: 'اختار اللغة',
      themes: {
        space: 'الفضاء',
        sea: 'البحر',
        coast: 'الساحل',
        forest: 'الغابة',
        desert: 'الصحراء',
        city: 'المدينة',
        sunset: 'الغروب',
        mountain: 'الجبل',
        polar: 'القطبي',
        night: 'الليل',
      }
    },
  },
  hi: {
    translation: {
      work: 'ध्यान',
      shortBreak: 'छोटा ब्रेक',
      longBreak: 'लंबा ब्रेक',
      selectTheme: 'थीम चुनें',
      selectLanguage: 'भाषा चुने',
      themes: {
        space: 'अंतरिक्ष',
        sea: 'समुद्र',
        coast: 'तट',
        forest: 'वन',
        desert: 'रेगिस्तान',
        city: 'शहर',
        sunset: 'सूर्यास्त',
        mountain: 'पहाड़',
        polar: 'ध्रुवीय',
        night: 'रात',
      }
    },
  },
  nl: {
    translation: {
      work: 'Focus',
      shortBreak: 'Korte Pauze',
      longBreak: 'Lange Pauze',
      selectTheme: 'Kies Thema',
      selectLanguage: 'Kies Taal',
      themes: {
        space: 'Ruimte',
        sea: 'Zee',
        coast: 'Kust',
        forest: 'Bos',
        desert: 'Woestijn',
        city: 'Stad',
        sunset: 'Zonsondergang',
        mountain: 'Berg',
        polar: 'Polair',
        night: 'Nacht',
      }
    },
  },
  sv: {
    translation: {
      work: 'Fokus',
      shortBreak: 'Kort Rast',
      longBreak: 'Lång Rast',
      selectTheme: 'Välj Tema',
      selectLanguage: 'Välj Språk',
      themes: {
        space: 'Rymd',
        sea: 'Hav',
        coast: 'Kust',
        forest: 'Skog',
        desert: 'Öken',
        city: 'Stad',
        sunset: 'Solnedgång',
        mountain: 'Berg',
        polar: 'Polär',
        night: 'Natt',
      }
    },
  },
};

const getLocale = () => {
    const locales = Localization.getLocales();
    return locales[0]?.languageCode || 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocale(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

