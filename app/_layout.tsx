import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tu pantalla de Login será la principal */}
      <Stack.Screen name="iniciar_sesion" />
      <Stack.Screen name="registro" />
      {/* Tu grupo del panel */}
      <Stack.Screen name="(drawer)" />
    </Stack>
  );
}