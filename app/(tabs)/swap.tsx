import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from "react";


export default function SwapScreen() {

  const [fromAmount, setFromAmount] = useState("100");
  const [toAmount, setToAmount] = useState("0.2814");
  const [fromToken, setFromToken] = useState("USDC");
  const [toToken, setToToken] = useState("SOL");

  const swapTokens = () =>{
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setFromToken(toToken);
    setToToken(fromToken);
  }

  const handleSwap = () => {
    if (!fromAmount) return Alert.alert("Enter amount to swap");
    Alert.alert(
      "Swap",
      `Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`,
    );
  };

  return (
      <ScrollView style={s.container}>
        <Text style={s.title}>Swap Tokens</Text>
        <View style={s.card}>
          <View style={s.cardHeader}>
            <TouchableOpacity style={s.token}>
              <View style={[s.tokenIcon, {backgroundColor: "#11ba74"}]}>
                <Text style={s.tokenIconText}>$</Text>
              </View>
              <Text style={s.tokenName}>{fromToken}</Text>
              <Ionicons name="chevron-down" size={20} color="white" />
            </TouchableOpacity>
            <TextInput
            style={s.tokenAmount}
            placeholder="0.00"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value = {fromAmount}
            onChangeText = {setFromAmount}
            />
          </View>
          <View style={s.cardFooter}>
            <Text style={s.balanceText}> Balance: 100 {fromToken}</Text>
            <Text style={s.usdText}>$50</Text>
          </View>
        </View>

        <View style={s.arrowContainer}>
          <TouchableOpacity style={s.swapArrow} onPress={swapTokens}>
            <Ionicons name="arrow-down" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={s.card}>
        <View style={s.cardHeader}>
          <TouchableOpacity style={s.token}>
            <View style={[s.tokenIcon, { backgroundColor: "#2775CA" }]}>
              <Text style={s.tokenIconText}>S</Text>
            </View>
            <Text style={s.tokenName}>{toToken}</Text>
            <Ionicons name="chevron-down" size={18} color="#888" />
          </TouchableOpacity>
          <TextInput
            style={s.tokenAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor="#666"
            value = {toAmount}
            onChangeText ={setToAmount}
          />
        </View>
        <View style={s.cardFooter}>
          <Text style={s.balanceText}>Balance: 250 {toToken}</Text>
          <Text style={s.usdText}>$499.419</Text>
        </View>
      </View>

        <TouchableOpacity style={s.swapButton} onPress={handleSwap}>
          <Text style={s.buttonText}>Swap</Text>
        </TouchableOpacity>
      </ScrollView>
  )
}

const s = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#686BEB",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  title:{
    fontSize: 24,
    fontWeight: 400,
    color: "#FFFFFF",
    marginTop:60,
    paddingHorizontal: 6,
  },
  card:{
    marginTop: 15,
    backgroundColor: "#2a2a3a",
    borderRadius: 16,
    borderWidth:1,
    borderColor: "#2A2A35",
    padding: 12,
  },
  cardHeader:{
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  token:{
    backgroundColor: "#116758",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft:8,
    paddingRight:12,
    paddingVertical: 5,
    borderRadius: 22,
    gap:5,
  },
  tokenIcon:{
    width:32,
    height:32,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenIconText:{
    fontSize:14,
    fontWeight:"600",
    color: "#FFFFFF",
  },
  tokenName:{
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  tokenarrow:{
    zIndex: 10,
    alignItems: "center",
  },
  tokenAmount:{
    fontSize: 40,
    fontWeight:"400",
    color: "#FFFFFF",
    marginLeft:10,
    flex:1,
    textAlign: "right",
  },
  cardFooter:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  balanceText:{
    fontSize: 14,
    color:"#666",
  },
  usdText:{
    fontSize: 14,
    color:"#666",
  },
  arrowContainer:{
    alignItems: "center",
    marginVertical: -28,
    zIndex:10,
  },
  swapArrow: {
    backgroundColor: "#0D0D12",
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0D0D12",
  },
  swapButton: {
    backgroundColor: "#3abd3a",
    paddingVertical:14,
    borderRadius:10,
    alignItems: "center",
    marginTop:16,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight:"bold",
  },
})