import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getBalance, getTokens, getTxns, short, timeAgo } from "../../src/services/methods";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "../../src/stores/wallet-store";
import { FavouriteButton } from "../../src/components/FavouriteButton";
import { ConnectButton } from "../../src/components/ConnectButton";
import { useWallet } from "../../src/hooks/useWallet"
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SwipeableHistoryItem } from "../../src/components/SwipeableHistoryItem";

export default function WalletScreen() {

  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [txns, setTxns] = useState<any[]>([]);


  const addToHistory = useWalletStore((s) => s.addToHistory);
  const isDevnet = useWalletStore((s) => s.isDevnet);
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const wallet = useWallet();
  const router = useRouter();

  const handleSearch = async (address:string) => {
    addToHistory(address);
    search()
  };

  const search = async() =>{
    const trimmedAddress = address.trim();
    if(!trimmedAddress) return Alert.alert("Enter a wallet address");

    setLoading(true);
    addToHistory(trimmedAddress);
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

  const searchFromHistory = (addr: string) => {
    setAddress(addr);
    addToHistory(addr);
    setLoading(true);
    Promise.all([getBalance(addr), getTokens(addr), getTxns(addr)])
      .then(([bal, tok, tx]) => {
        setBalance(bal);
        setTokens(tok);
        setTxns(tx);
      })
      .catch((e: unknown) => {
        const message = e instanceof Error ? e.message : "Unknown error";
        Alert.alert("Error", message);
      })
      .finally(() => setLoading(false));
  };

  const clearResults = () => {
    setAddress("");
    setBalance(null);
    setTokens([]);
    setTxns([]);
  };

  //load connected wallet when wallet wallet connects
  const prevConnected = useRef(false);
  useEffect(() => {
    if (wallet.connected && wallet.publicKey && !prevConnected.current) {
      const addr = wallet.publicKey.toBase58();
      setAddress(addr);
      searchFromHistory(addr);
    }
    prevConnected.current = wallet.connected;
  }, [wallet.connected, wallet.publicKey]);

  return (
    <SafeAreaView style={s.safe} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={s.container}>

          <View style={s.Banner}>
            <Text style={s.title}>SolTrace</Text>

            <View style={s.bannerRight}>
              <Text style={s.netText}>{isDevnet? "Devnet": "Mainnet"}</Text>
            </View>
          </View>

          <View style={s.subBanner}>
            <View>
              <Text style={s.subTitle}>Explore any Solana Wallet</Text>
            </View>
            <View>
              <ConnectButton
              connected={wallet.connected}
              connecting={wallet.connecting}
              publicKey={wallet.publicKey?.toBase58() ?? null}
              onConnect={wallet.connect}
              onDisconnect={wallet.disconnect}/>
            </View>
          </View>

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
            <View style={s.btnRow}>
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

            <TouchableOpacity style={s.btnGhost} onPress={clearResults}>
              <Text style={s.btnGhostText}>Clear</Text>
            </TouchableOpacity>
            </View>
            

            {searchHistory.length > 0 && balance === null &&(
              <Animated.View 
                style={s.historySection}
                entering ={FadeInDown.delay(100).springify()}>
                <Text style={s.historyTitle}>Recent Searches</Text>
                {searchHistory.slice(0,5).map((addr, index) => (
                  <SwipeableHistoryItem
                  key={addr}
                  address={addr}
                  index={index}
                  onPress={() => searchFromHistory(addr)}
                  onDelete={() => useWalletStore.getState().removeFromHistory(addr)}
                />
                ))}
              </Animated.View>
            )}

            {/* SOL Balance card*/}

            {balance !== null && (
              <Animated.View
                style={s.card}
                entering={FadeInDown.delay(100).springify()}>
                <View style={s.favLine}>
                  <Text style={s.label}>SOL Balance</Text>
                  <View>
                  <FavouriteButton address={address.trim()}/>
                  </View>
                </View>
                <View style={s.balanceRow}>
                  <Text style={s.balance}>{balance.toFixed(4)}</Text>
                  <Text style={s.sol}>SOL</Text>
                </View>
                <Text style={s.addr}>{short(address.trim(), 6)}</Text>
                {wallet.connected && (
                <TouchableOpacity
                  style={s.sendNav}
                  onPress={() => router.push("/send")}
                >
                  <Ionicons name="paper-plane" size={18} color="#0D0D12" />
                  <Text style={s.sendNavText}>Send SOL</Text>
                </TouchableOpacity>
              )}
              </Animated.View>
            )}
          </View>

          {tokens.length > 0 && (
            <Animated.View entering={FadeInDown.delay(200).springify()}>
              <Text style={s.section}>Tokens ({tokens.length})</Text>
              {tokens.map((item: { mint: string; amount: number }, index: number) => (
                <Animated.View
                  key={item.mint}
                  entering={FadeInDown.delay(250 + index * 50).springify()}
                >
                  <TouchableOpacity
                    style={s.row}
                    onPress={() =>
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
                </Animated.View>
              ))}
            </Animated.View>
        )}
        {txns.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
              <Text style={s.section}>Recent Transactions</Text>
              {txns.map((item: { sig: string; time: number; ok: boolean }, index: number) => (
                <Animated.View
                  key={item.sig}
                  entering={FadeInDown.delay(350 + index * 50).springify()}
                >
                  <TouchableOpacity
                    style={s.row}
                    onPress={() =>
                      Linking.openURL(
                        `https://solscan.io/tx/${item.sig}${isDevnet ? "?cluster=devnet" : ""}`
                      )
                    }
                  >
                    <View>
                      <Text style={s.mint}>{short(item.sig, 8)}</Text>
                      <Text style={s.time}>
                        {item.time ? timeAgo(item.time) : "pending"}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: item.ok ? "#14F195" : "#EF4444",
                        fontSize: 18,
                      }}
                    >
                      {item.ok ? "+" : "-"}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </Animated.View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0D0D12",
  },
  container:{
    flex:1,
    height: "100%",
    backgroundColor: "#00cdcd",
    paddingTop:20,
    paddingHorizontal: 12,
  },
  title:{
    fontSize : 48,
    color:"#ffffff",
    fontWeight: 900,
  },
  subTitle:{
    fontSize: 16,
    color:"#141F5C",
  },
  inputContainer:{
    marginTop:40,
    backgroundColor: "#171b34",
    borderRadius: 12,
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    color: "#FFFFFF",
    fontSize: 20,
    paddingVertical: 14,
  },
  searchButton:{
    flex: 1,
    backgroundColor: "#179217",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText:{
    color: "#ffffff",
    fontSize:24,
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
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingLeft:105,
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
  bannerRight:{
    backgroundColor: "#4945c2",
    paddingHorizontal:10,
    borderRadius: 16,
    paddingVertical:3,
    borderColor:"#2d64e3",
    borderWidth:2,
    flexDirection: "row",
    alignContent:"center",
  },
  netText:{
    fontSize:20,
    color: "#FFFFFF",
    fontWeight:600,
  },
  Banner:{
    flexDirection: "row",
    alignItems:"center",
    paddingTop:8,
    justifyContent:"space-between",
    paddingLeft:5,
  },
  subBanner :{
    paddingLeft:5,
    marginTop:-2,
    alignItems:"center",
    flexDirection: "row",
    justifyContent : "space-between",
  },
  favLine:{
    flexDirection:"row",
    alignItems:"center",
    width:"100%",
    gap:110,
  },
  btnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  btnGhost: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#16161D",
    borderWidth: 1,
    borderColor: "#2A2A35",
  },
  btnGhostText: {
    color: "#9CA3AF",
    fontSize: 15,
  },
  historySection: {
    marginTop: 24,
  },
  historyTitle: {
    color: "#141F5C",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#16161D",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#2A2A35",
    gap: 12,
  },
  historyAddress: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "monospace",
  },
  sendNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#14F195",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  sendNavText: {
    color: "#0D0D12",
    fontSize: 15,
    fontWeight: "600",
  },

});
