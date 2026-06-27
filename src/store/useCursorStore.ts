import { create } from 'zustand'

export type CursorState = 'default' | 'pointer' | 'view' | 'drag' | 'hidden'

interface CursorStore {
  state: CursorState
  label: string
  setState: (state: CursorState) => void
  setLabel: (label: string) => void
}

export const useCursorStore = create<CursorStore>((set) => ({
  state: 'default',
  label: '',
  setState: (state) => set({ state }),
  setLabel: (label) => set({ label }),
}))
