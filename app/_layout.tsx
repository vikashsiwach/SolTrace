import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-get-random-values";


export default function RootLayout() {
  return (
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
  );
}