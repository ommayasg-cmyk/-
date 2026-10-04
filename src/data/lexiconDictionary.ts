export interface DictionaryEntry {
  word: string;
  root: string;
  weight: string; // الوزن الصرفي
  meaning: string;
  modernLookup: {
    dictionary: string;
    chapter: string; // باب
    order: string;
  };
  ancientLookup: {
    dictionary: string;
    chapter: string; // باب الحرف الأخير
    section: string; // فصل الحرف الأول
  };
  derivatives: string[];
  examples: string[];
}

export const SAMPLE_LEXICON_ENTRIES: Record<string, DictionaryEntry> = {
  'استعلام': {
    word: 'اسْتِعْلَام',
    root: 'ع - ل - م',
    weight: 'اسْتِفْعَال',
    meaning: 'طلب معرفة الشيء والوقوف على حقيقته وخبره.',
    modernLookup: {
      dictionary: 'المعجم الوسيط',
      chapter: 'باب العين (ع)',
      order: 'مراعاة اللام ثم الميم (ع - ل - م)'
    },
    ancientLookup: {
      dictionary: 'لسان العرب / القاموس المحيط',
      chapter: 'باب الميم (الحرف الأخير)',
      section: 'فصل العين (الحرف الأول)'
    },
    derivatives: ['عَلِمَ', 'يَعْلَمُ', 'عَالِم', 'مَعْلُوم', 'عَلِيم', 'مُعَلِّم', 'تَعْلِيم'],
    examples: ['استعلم المسافرُ عن موعد القطار.', 'إدارة الاستعلامات تقدم المساعدة.']
  },
  'انتصار': {
    word: 'انْتِصَار',
    root: 'ن - ص - ر',
    weight: 'افْتِعَال',
    meaning: 'الظفر والغلبة على الخصم وتحقيق الفوز.',
    modernLookup: {
      dictionary: 'المعجم الوسيط',
      chapter: 'باب النون (ن)',
      order: 'مراعاة الصاد ثم الراء (ن - ص - ر)'
    },
    ancientLookup: {
      dictionary: 'لسان العرب / القاموس المحيط',
      chapter: 'باب الراء (الحرف الأخير)',
      section: 'فصل النون (الحرف الأول)'
    },
    derivatives: ['نَصَرَ', 'يَنْصُرُ', 'نَاصِر', 'مَنْصُور', 'اسْتَنْصَرَ', 'تَنَاصُر'],
    examples: ['حققت الأمة انتصاراً مجيداً.', 'الحق دائماً منصور.']
  },
  'استشهاد': {
    word: 'اسْتِشْهَاد',
    root: 'ش - هـ - د',
    weight: 'اسْتِفْعَال',
    meaning: 'طلب الشهادة أو الاستدلال بالدليل والنص.',
    modernLookup: {
      dictionary: 'المعجم الوسيط',
      chapter: 'باب الشين (ش)',
      order: 'مراعاة الهاء ثم الدال (ش - هـ - د)'
    },
    ancientLookup: {
      dictionary: 'لسان العرب',
      chapter: 'باب الدال (الحرف الأخير)',
      section: 'فصل الشين (الحرف الأول)'
    },
    derivatives: ['شَهِدَ', 'شَاهِد', 'شَهِيد', 'مَشْهَد', 'تَشَهُّد'],
    examples: ['استشهد الكاتب ببيت من الشعر.', 'استشهد الجندي دفاعاً عن وطنه.']
  },
  'ميزان': {
    word: 'مِيزَان',
    root: 'و - ز - ن',
    weight: 'مِفْعَال',
    meaning: 'الآلة التي يُوزن بها وتُعرف بها مقادير الأشياء، ومجازاً: العدل والقسطاس.',
    modernLookup: {
      dictionary: 'المعجم الوسيط',
      chapter: 'باب الواو (و)',
      order: 'مراعاة الزاي ثم النون (و - ز - ن)'
    },
    ancientLookup: {
      dictionary: 'القاموس المحيط',
      chapter: 'باب النون (الحرف الأخير)',
      section: 'فصل الواو (الحرف الأول)'
    },
    derivatives: ['وَزَنَ', 'يَزِنُ', 'وَزْن', 'مَوْزُون', 'اتَّزَنَ', 'مُوَازَنَة'],
    examples: ['وَأَقِيمُوا الْوَزْنَ بِالْقِسْطِ.', 'يحتاج الإنسان إلى ميزان الحكمة في تصرفاته.']
  },
  'تفاؤل': {
    word: 'تَفَاؤُل',
    root: 'ف - أ - ل',
    weight: 'تَفَاعُل',
    meaning: 'النظر إلى الجانب المشرق من الأحداث وتوقع الخير.',
    modernLookup: {
      dictionary: 'المعجم الوسيط',
      chapter: 'باب الفاء (ف)',
      order: 'مراعاة الهمزة ثم اللام (ف - أ - ل)'
    },
    ancientLookup: {
      dictionary: 'لسان العرب',
      chapter: 'باب اللام (الحرف الأخير)',
      section: 'فصل الفاء (الحرف الأول)'
    },
    derivatives: ['فَأَلَ', 'فَأْل', 'مُتَفَائِل', 'اسْتَفْأَلَ'],
    examples: ['التفاؤل يمنح الروح طاقة وأملاً.', 'كان النبي ﷺ يحب الفأل الحسن.']
  }
};

export function lookupWordInLexicon(query: string): DictionaryEntry {
  const clean = query.trim().replace(/[ًٌٍَُِّْ]/g, '');
  if (SAMPLE_LEXICON_ENTRIES[clean]) {
    return SAMPLE_LEXICON_ENTRIES[clean];
  }

  // Algorithmic rule-based extraction for any arbitrary Arabic word!
  let stripped = clean;
  // remove definite article
  if (stripped.startsWith('ال') && stripped.length > 4) {
    stripped = stripped.substring(2);
  }
  // remove prefixes (استـ, انـ, تـ, مـ)
  if (stripped.startsWith('است') && stripped.length >= 6) {
    stripped = stripped.substring(3);
  } else if (stripped.startsWith('ان') && stripped.length >= 5) {
    stripped = stripped.substring(2);
  } else if (stripped.startsWith('ت') && stripped.length >= 5) {
    stripped = stripped.substring(1);
  } else if (stripped.startsWith('م') && stripped.length >= 5) {
    stripped = stripped.substring(1);
  }

  // remove infix/suffix (alif, waw, ya, taa marboota, etc.)
  let chars = stripped.split('').filter(c => !['ة', 'ه', 'ي', 'و', 'ا', 'ى', 'ت'].includes(c) || stripped.length <= 3);
  if (chars.length < 3) {
    chars = clean.slice(0, 3).split('');
  }
  const rootChars = chars.slice(0, 3);
  const root = rootChars.join(' - ');
  const first = rootChars[0] || 'الأول';
  const last = rootChars[rootChars.length - 1] || 'الأخير';

  return {
    word: query,
    root: root,
    weight: 'مُشْتَقّ (فعل ثلاثي مجرد)',
    meaning: `بيان معجمي لمادة (${root}) ومشتقاتها في العربية الفصحى.`,
    modernLookup: {
      dictionary: 'المعجم الوسيط / المنجد',
      chapter: `باب حرف (${first})`,
      order: `ترتيب هجائي حسب أوائل الكلمات: ${root}`
    },
    ancientLookup: {
      dictionary: 'لسان العرب / القاموس المحيط',
      chapter: `باب (${last}) الحرف الأخير`,
      section: `فصل (${first}) الحرف الأول`
    },
    derivatives: [`فَعَلَ`, `فَاعِل`, `مَفْعُول`, `تَفْعِيل`, `اسْتِفْعَال`],
    examples: [`وردت المادة في نصوص الفصحى للدلالة على أصل المعنى الأساسي.`]
  };
}
