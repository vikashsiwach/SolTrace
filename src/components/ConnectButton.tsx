import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  connected : boolean;
  connecting : boolean;
  publicKey : string | null;
  onConnect : () => void;
  onDisconnect : ()  => void;
}

export function ConnectButton({
  connected,
  connecting,
  publicKey,
  onConnect,
  onDisconnect,
  }:Props) {
    if (connecting) {
      return (
        <View style={[s.button ,s.connecting]}>  
          <ActivityIndicator size="small" color="#fff"/>
          <Text style={s.buttonText}>Connecting...</Text>
        </View>
      );
    }

    if (connected && publicKey) {
      return (
        <TouchableOpacity
        style={[s.button, s.connected]}
        onPress={onDisconnect}
        >
          <Ionicons name="wallet" size={18} color="#14F195" />
          <Text style={s.connectedText}>{publicKey.slice(0,4)}...{publicKey.slice(-4)}</Text>
          <Ionicons name="close-circle-outline" size={16} color="#888" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
      style={[s.button, s.disconnected]}
      onPress={onConnect}>
        <Ionicons name="wallet-outline" size={18} color="#fff" />
        <Text style={s.buttonText}>Connect Wallet</Text>
      </TouchableOpacity>
    )
}

const s = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
  },
  disconnected: {
    backgroundColor: "#9945FF",
    borderColor: "#9945FF",
  },
  connected: {
    backgroundColor: "#197168",
    borderColor: "#14F195",
  },
  connecting: {
    backgroundColor: "#16161D",
    borderColor: "#2A2A35",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  connectedText: {
    color: "#14F195",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "monospace",
  },
});