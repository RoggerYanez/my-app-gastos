import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { supabase } from '../lib/supabase';

export default function RootLayout() {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const forceLogout = async () => {
      await supabase.auth.signOut();
      router.replace('/iniciar_sesion');
    };
    forceLogout();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="iniciar_sesion" />
        <Stack.Screen name="registro" />
        <Stack.Screen name="(drawer)" />
      </Stack>
    </>
  );
}