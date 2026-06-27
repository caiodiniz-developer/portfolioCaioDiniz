import { useLanguageStore } from '@/store/useLanguageStore'
import { translations, type Translations } from '@/data/i18n'

export function useT(): Translations {
  const lang = useLanguageStore((s) => s.lang)
  return translations[lang] as unknown as Translations
}
