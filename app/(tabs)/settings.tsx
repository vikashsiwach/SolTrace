import { useRouter } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'


export default function SettingsScreen() {

  const router = useRouter();


  return (
   <SafeAreaView style={s.safe} edges={["top"]}>
    <ScrollView style={s.scroll}>
      <Text style={s.title}>Settings</Text>
      <Text style={s.subtitle}>Configure wallet explorer</Text>


      <Text>Network</Text>
      <View>
        <View>
          <View>
            <View>
              
            </View>
          </View>
        </View>
      </View>
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
    paddingHorizontal:16,
    paddingTop:16,
  },
  title:{
    fontSize:36,
    color:"#FFFFFF",
    fontWeight: 700,
    marginBottom:10,
  },
  subtitle:{
    fontSize: 16,
    color:"#FFFFFF",
    marginBottom:32,
  },

});