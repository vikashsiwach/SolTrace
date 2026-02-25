import { useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useWalletStore } from '../../src/stores/wallet-store';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {

  const router = useRouter();

  const isDevnet = useWalletStore((s) => s.isDevnet);
  const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const favourites = useWalletStore((s) => s.favourites);
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const clearHistory = useWalletStore((s) => s.clearHistory);


  return (
   <SafeAreaView style={s.safe} edges={["top"]}>
    <ScrollView style={s.scroll}>
      <Text style={s.title}>Settings</Text>
      <Text style={s.subtitle}>Configure wallet explorer</Text>


      <Text style ={s.sectionTitle}>Network</Text>
      <View style={s.card}>
        <View style={s.row}>
          <View style ={s.rowLeft}>
            <View style = {[s.iconBox, isDevnet && s.iconBoxDevnet]}>
              <Ionicons
                  name={isDevnet ? "flask" : "globe"}
                  size={20}
                  color={isDevnet ? "#F59E0B" : "#dce5e1"}
                />
            </View>
            <View>
              <Text style={s.label}>{isDevnet ? "Devnet": "Mainnet"}</Text>
              <Text style={s.sublabel}>{isDevnet ? "Testing Network" :"Production Network"}</Text>
            </View>
          </View>
          <Switch
          value = {isDevnet}
          onValueChange = {toggleNetwork}
          trackColor= {{true:"#14F195", false:"#2A2A35"}}
          thumbColor = "#FFFFFF"/>
        </View>
      </View>

      <Text style={s.sectionTitle}>Data</Text>
      <View style={s.card}>
        <TouchableOpacity style={s.row} onPress={() =>router.push("/watchlist")}>
          <View style={s.rowLeft}>
            <View style={s.iconBox}>
              <Ionicons name="heart" size={20} color="#14F195" />
            </View>
            <Text style={s.label}>Saved Wallets</Text>
          </View>
          <View style={s.rowRight}>
            <View style={s.badge}>
              <Text style={s.badgeText}>{favourites.length}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>

        <View style={s.divider}/>

        <View style={s.row}>
          <View style={s.rowLeft}>
            <View style={s.iconBox}>
              <Ionicons name="time" size={20} color="#14F195" />
            </View>
            <Text style={s.label}> Search History</Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeText}>{searchHistory.length}</Text>
          </View>
        </View>
      </View>

      <Text style={s.sectionTitle}>Danger Zone</Text>
      <TouchableOpacity
      style={s.dangerButton}
      onPress={()=> {
        Alert.alert(
          "ClearHistory",
          "This will remove all your search History. Favourites won't be affected",
          [
            {text:"Cancel", style:"cancel"},
            {text: "Clear", style: "destructive", onPress:clearHistory},
          ]
        );
      }}>
        <Ionicons name="trash-outline" size={20} color="#EF4444" />
        <Text style={s.dangerText}>Clear Search History</Text>
      </TouchableOpacity>
    </ScrollView>
   </SafeAreaView>
  )
}

const s = StyleSheet.create ({
  safe:{
    flex:1,
    backgroundColor: "#686BEB",
  },
  scroll:{
    flex:1,
    paddingHorizontal:22,
    paddingTop:26,
  },
  title:{
    fontSize:36,
    color:"#FFFFFF",
    fontWeight: 700,
    marginBottom:10,
  },
  subtitle:{
    fontSize: 16,
    color:"#3a3e46",
    marginBottom:32,
  },
  sectionTitle:{
    color:"#393434",
    fontSize:13,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom:12,
    marginTop:8,
  },
  card:{
    backgroundColor: "#4b4747",
    borderWidth:1,
    borderColor: "#443c3c",
    padding:4,
    marginBottom:24,
    borderRadius:16,
  },
  row:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  rowLeft:{
    flexDirection: "row",
    alignItems: "center",
    gap:12,
  },
  iconBox:{
    width:40,
    height:40,
    borderRadius: 10,
    backgroundColor: "#1E1E28",
    alignItems:"center",
    justifyContent: "center",
  },
  iconBoxDevnet :{
    backgroundColor: "#2D2310"
  },
  label:{
    fontSize:16,
    color: "#FFFFFF",
    marginTop:2,
  },
  sublabel:{
    fontSize:12,
    color:"#9494dc",
    marginTop:2,
  },
  rowRight:{
    flexDirection: "row",
    alignItems: "center",
    gap:8,
  },
  badge:{
    backgroundColor: "#1E1E28",
    paddingHorizontal:12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText:{
    color:"#14F195",
    fontSize: 14,
    fontWeight:"600",
  },
  divider:{
    height:1,
    backgroundColor:"#2A2A35",
    marginHorizontal:14,
  },
  dangerButton:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:8,
    backgroundColor:"#1A1215",
    borderWidth:1,
    borderColor:"#3D2023",
    paddingVertical:16,
    borderRadius: 14,
  },
  dangerText:{
    color: "#EF4444",
    fontSize: 16,
    fontWeight:"600",
  },
});