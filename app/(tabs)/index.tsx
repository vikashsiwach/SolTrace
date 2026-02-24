import { useState } from "react";
import { ActivityIndicator, Alert, FlatList, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getBalance, getTokens, getTxns, short, timeAgo } from "../../services/methods";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function WalletScreen() {

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);

  const router = useRouter();

  const search = async() =>{
    const trimmedAddress = address.trim();
    if(!trimmedAddress) return Alert.alert("Enter a wallet address");

    setLoading(true);
    try{
      const [balance, tokens, tx] = await Promise.all([
        getBalance(trimmedAddress),
        getTokens(trimmedAddress),
        getTxns(trimmedAddress),
      ]);
      setBalance(balance);
      setTokens(tokens);
      setTxns(tx);
    } catch(e:any){
      Alert.alert("Error fetching data");
    }
    setLoading(false);
  };

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
          <TouchableOpacity
            style={[s.searchButton, loading && s.btnDisabled]}
            onPress={search}
            disabled={loading}
            >
            {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={s.btnText}>Search</Text>
          )}
        </TouchableOpacity>

        {/* SOL Balance card*/}
        
        {balance !== null && (
          <View style={s.card}>
            <Text style={s.label}>SOL Balance</Text>
            <View style={s.balanceRow}>
              <Text style={s.balance}>{balance.toFixed(4)}</Text>
              <Text style={s.sol}>SOL</Text>
            </View>
            <Text style={s.addr}>{short(address.trim(), 6)}</Text>
          </View>
        )}
        </View>

        {tokens.length > 0 && (
        <>
          <Text style={s.section}>Tokens ({tokens.length})</Text>
          <FlatList
            data={tokens}
            keyExtractor={(t) => t.mint}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style= {s.row}
                onPress ={() =>
                  router.push(`/token/${item.mint}?amount=${item.amount}`)
                }
                >
                  <Text style={s.mint}>{short(item.mint, 6)}</Text>
                  <View style={s.tokenRight}>
                    <Text style={s.amount}>{item.amount}</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#6B7280"
                    />
                  </View>
              </TouchableOpacity>

            )}
          />
        </>
      )}
      {txns.length > 0 && (
        <>
          <Text style={s.section}>Recent Transactions</Text>
          <FlatList
            data={txns}
            keyExtractor={(t) => t.sig}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.row}
                onPress={() =>
                  Linking.openURL(`https://soltrace.io/tx/${item.sig}`)
                }
              >
                <View>
                  <Text style={s.mint}>{short(item.sig, 8)}</Text>
                  <Text style={s.time}>
                    {item.time ? timeAgo(item.time) : "pending"}
                  </Text>
                </View>
                <Text style={{ color: item.ok ? "#14F195" : "#EF4444", fontSize: 18 }}>
                  {item.ok ? "+" : "-"}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}
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
    fontSize : 32,
    paddingTop: 80,
    paddingLeft: 16,
    color:"#ffffff",
    fontWeight: 900,
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
  searchButton:{
    borderRadius:8,
    backgroundColor: "#3abd3a",
    marginTop:40,
    height:60,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText:{
    color: "#ffffff",
    fontSize:26,
    fontWeight: "bold",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  card: {
    backgroundColor: "#16161D",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  label: {
    color: "#6B7280",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
  },
  balance: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "700",
  },
  sol: {
    color: "#14F195",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  addr: {
    color: "#9945FF",
    fontSize: 13,
    fontFamily: "monospace",
    marginTop: 16,
    backgroundColor: "#1E1E28",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  section: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 32,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#16161D",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  mint: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
  },
  amount: {
    color: "#14F195",
    fontSize: 15,
    fontWeight: "600",
  },
  time: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  tokenRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
})