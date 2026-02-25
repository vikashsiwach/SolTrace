import { create } from "zustand";

interface WalletState{

  favourites: string[];
  searchHistory: string[];
  isDevnet: boolean;

  addFavourite: (address:string) => void;
  removeFavourite: (address:string) => void;
  isFavourite: (address:string) => boolean;
  addToHistory: (address:string) => void;
  clearHistory: () => void;
  toggleNetwork: () => void;
}

export const useWalletStore = create<WalletState>((set,get) => ({

  favourites: [],
  searchHistory: [],
  isDevnet: false,

  addFavourite: (address) => 
    set((state) => ({
      favourites: state.favourites.includes(address) // returning a partial object favourite
      ? state.favourites
      :[address, ...state.favourites],
    })),

  removeFavourite: (address) => 
    set((state) => ({
      favourites: state.favourites.filter((a) => a !== address),
    })),

  isFavourite: (address) => get().favourites.includes(address),

  addToHistory: (address) => 
    set((state) => ({
      searchHistory: [
        address,
        ...state.searchHistory.filter((a) => a !== address),
      ].slice(0,20),
  })),

  clearHistory: () =>
    set({searchHistory: [] }),

  toggleNetwork: () => 
    set((state) => ({isDevnet : !state.isDevnet})),

}));