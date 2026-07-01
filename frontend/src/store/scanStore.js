import { create } from 'zustand'

export const useScanStore = create((set) => ({
  currentIngredients: null,
  lastResult: null,
  isAnalysing: false,

  setCurrentIngredients: (ingredients) =>
    set({ currentIngredients: ingredients }),
  setLastResult: (result) => set({ lastResult: result }),
  setIsAnalysing: (isAnalysing) => set({ isAnalysing }),
  clearScan: () =>
    set({ currentIngredients: null, lastResult: null, isAnalysing: false }),
}))
