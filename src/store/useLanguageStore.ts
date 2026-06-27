import { create } from 'zustand'
import type { Lang } from '@/data/i18n'

interface LanguageStore {
  lang: Lang
  toggle: () => void
  setLang: (lang: Lang) => void
}

export const useLanguageStore = create<LanguageStore>((set, get) => ({
  lang: 'pt',
  toggle: () => set({ lang: get().lang === 'en' ? 'pt' : 'en' }),
  setLang: (lang) => set({ lang }),
}))
