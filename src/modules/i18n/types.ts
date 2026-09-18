export type AppLanguage = 'en' | 'ar' | 'fr' | 'ur';
export type TextDirection = 'ltr' | 'rtl';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  direction: TextDirection;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰' },
];

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];
