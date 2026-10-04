export interface MotivationalData {
  quote: string;
  badge: string;
  level: string;
  tierColor: string;
}

export function getMotivationalMessage(percentage: number): MotivationalData {
  if (percentage >= 90) {
    return {
      quote: 'تبارك الرحمن! بارك الله في همّتك العالية وفصاحة لسانك، أنت فخر للمدارس الأهلية الخاصة ونموذج يُحتذى في حب لغة الضاد وإتقان علومها!',
      badge: 'وسام التميز اللغوي الفائق',
      level: 'ممتاز مع مرتبة الشرف 🌟',
      tierColor: '#059669', // Emerald
    };
  } else if (percentage >= 75) {
    return {
      quote: 'إنجاز رائع ومتميز! لغتك العربية عنوان هويتك، خطوت خطوات واثقة نحو إتقان الفصاحة والبيان، واصل تميزك وإبداعك بعزيمة!',
      badge: 'وسام الإتقان المعرفي',
      level: 'جيد جداً مرتفع 🏅',
      tierColor: '#0d9488', // Teal
    };
  } else if (percentage >= 60) {
    return {
      quote: 'جهد مبارك وعزيمة طيبة! الدرب يبدأ بخطوة، وبمزيد من التدريب والمطالعة ستكون في طليعة المتفوقين دائماً.',
      badge: 'وسام المجتهد الواعد',
      level: 'مستوى جيد ومتقدم 🎯',
      tierColor: '#d97706', // Amber
    };
  } else {
    return {
      quote: 'محاولة شجاعة وبداية انطلاق حقيقية! الخطأ طريق التعلم، استمر في المران والمثابرة وستبهر الجميع بتقدمك القادم بإذن الله.',
      badge: 'شهادة المشاركة والمثابرة',
      level: 'يحتاج إلى مزيد من المران 🌱',
      tierColor: '#2563eb', // Blue
    };
  }
}
