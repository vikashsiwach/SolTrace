import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';


export default function TokenDetailScreen() {
  const {mint} = useLocalSearchParams<{mint: string}>();
  const router = useRouter();
  
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokenInfo();
  }, [mint]);

  const fetchTokenInfo = async() =>{
    try {
      const response = await fetch("https://api.devnet.solana.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getTokenSupply",
          params: [mint],
        }),
      });
      const data = await response.json();

      setTokenInfo({
        mint: mint,
        supply: data.result?.value?.uiAmount || 0,
        decimals: data.result?.value?.decimals || 0,
      });
    } catch (error) {
      console.error("Error fetching token info:", error);
    } finally {
      setLoading(false);
    }
  };

  if(loading){
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#14F195"/>
      </View>
    )
  }

  return (
   <ScrollView style={s.container}>
      <TouchableOpacity style={s.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={s.backText}>Back</Text>
      </TouchableOpacity>

      <View style={s.header}>
        <Text style={s.title}>Token Details</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardLabel}>Mint Address</Text>
        <Text style={s.mintAddress}>{mint}</Text>
      </View>

      {tokenInfo && (
        <View style={s.card}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Total Supply</Text>
            <Text style={s.infoValue}>
              {tokenInfo.supply?.toString() || "N/A"}
            </Text>
          </View>
          <View style={s.divider}>
            <View style={s.infoRow}>
              <Text style={s.infoLabel}>Decimals</Text>
              <Text style={s.infoValue}>{tokenInfo.decimals}</Text>
            </View>
          </View>
        </View>
      )}

      <TouchableOpacity  style={s.linkButton}
        onPress={()=>{

        }}>
       <Text style={s.linkButtonText}>View on SolScan</Text>
      </TouchableOpacity>
   </ScrollView>
  );

};
const s = StyleSheet.create({
  container:{
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#0a0a1a",
  },
  backButton:{
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText:{
    color: "#fff",
    fontSize:16,
    marginLeft: 8,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: {
    color: "#888",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  mintAddress: {
    color: "#9945FF",
    fontSize: 13,
    fontFamily: "monospace",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    color: "#888",
    fontSize: 14,
  },
  infoValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#2a2a3e",
  },
  linkButton: {
    backgroundColor: "#9945FF20",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  linkButtonText: {
    color: "#9945FF",
    fontSize: 14,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0a1a",
  }
});
