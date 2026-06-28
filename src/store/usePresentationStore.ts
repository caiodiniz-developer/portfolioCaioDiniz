import { create } from 'zustand'

interface PresentationStore {
  active: boolean
  toggle: () => void
  exit: () => void
}

export const usePresentationStore = create<PresentationStore>((set) => ({
  active: false,
  toggle: () => set((s) => ({ active: !s.active })),
  exit:   () => set({ active: false }),
}))
