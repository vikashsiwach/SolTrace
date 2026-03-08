import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "../lib/storage";

//define the shape of object

interface WalletState{

  //data
  favourites: string[];
  searchHistory: string[];
  isDevnet: boolean;
  connectedPublicKey: string | null;

  //actions
  addFavourite: (address:string) => void;
  removeFavourite: (address:string) => void;
  isFavourite: (address:string) => boolean;
  addToHistory: (address:string) => void;
  clearHistory: () => void;
  toggleNetwork: () => void;
  setConnectedPublicKey: (publicKey: string | null) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set,get) => ({
  
  //initial state
  favourites: [],
  searchHistory: [],
  isDevnet: false,
  connectedPublicKey: null,

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

  setConnectedPublicKey: (publicKey) => set({ connectedPublicKey: publicKey }),
}),
  {
    name: "wallet-storage",
    storage: createJSONStorage(() => mmkvStorage),
  }
));
