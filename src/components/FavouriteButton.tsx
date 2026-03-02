import { StyleSheet, TouchableOpacity } from "react-native";
import { useWalletStore } from "../stores/wallet-store";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  address: string;
}

export function FavouriteButton ({address}: Props){

  const addFavourite = useWalletStore((s) => s.addFavourite);
  const removeFavourite = useWalletStore((s) => s.removeFavourite);
  const favourites = useWalletStore((s) => s.favourites);
  const isFavourite = useWalletStore((s) => s.isFavourite);

  return (

    <TouchableOpacity
      onPress={() => {
        if (isFavourite(address)) {
          removeFavourite(address);
        } else {
          addFavourite(address);
        }
      }}
      style={s.button}>
      <Ionicons
        name={isFavourite(address) ? "heart" : "heart-outline"} 
        size={24}
        color={ isFavourite(address) ? "#FF4545" : "#666"} />
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  button: {
    padding:8,
  },
});