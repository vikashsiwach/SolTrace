import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-get-random-values";
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="token/[mint]" />
        <Stack.Screen
          name="send"
          options={{
            presentation: "modal",
          }}/>
      </Stack>
    </SafeAreaProvider>
    </GestureHandlerRootView>
    
  );
}