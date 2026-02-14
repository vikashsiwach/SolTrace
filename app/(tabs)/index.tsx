import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";


export default function WalletScreen() {

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);

  return (
      <ScrollView style={s.container}>
        <Text style={s.title}>Welcome to SolTrace</Text>
        <Text style={s.subTitle}>Explore any Solana Wallet</Text>
        <View style={s.inputContainer}>
          <TextInput
            style={s.input}
            placeholder="Enter Solana Wallet Address"
            placeholderTextColor="#6B7280"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            autoCorrect={false}
            selectTextOnFocus={true}
            editable={true}
            />
        </View>
        <View>
          <TouchableOpacity>

          </TouchableOpacity>
        </View>
      </ScrollView>
  );
}
const s = StyleSheet.create({
  container:{
    flex:1,
    height: "100%",
    backgroundColor: "#686BEB",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  title:{
    fontSize : 30,
    paddingTop: 80,
    paddingLeft: 16,
    color:"#ffffff",
  },
  subTitle:{
    paddingTop:14,
    paddingLeft: 44,
    fontSize: 18,
    color:"#141F5C",  
  },
  inputContainer:{
    marginTop:50,
    backgroundColor: "#171b34",
    borderRadius: 12,
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    color: "#FFFFFF",
    fontSize: 15,
    paddingVertical: 14,
  },

})