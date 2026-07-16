import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { supabase } from '../lib/supabase';

export default function IniciarSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  async function iniciarSesion() {
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .ilike('username', cleanUsername)
      .single();

    if (profileError || !profile) {
      Alert.alert('Error', 'Usuario no encontrado');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: profile.email, password: password });
    if (error) Alert.alert('Error', error.message);
    else router.replace('/(drawer)');
  }

  // Estilos adaptativos
  const themeStyles = {
    container: { backgroundColor: isDark ? '#121212' : '#f5f5f5' },
    text: { color: isDark ? '#fff' : '#333' },
    input: { 
      backgroundColor: isDark ? '#1e1e1e' : '#fff', 
      borderColor: isDark ? '#444' : '#ccc',
      color: isDark ? '#fff' : '#000'
    }
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.text]}>Bienvenido</Text>
      <TextInput style={[styles.input, themeStyles.input]} placeholder="Usuario" placeholderTextColor={isDark ? "#888" : "#999"} value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={[styles.input, themeStyles.input]} placeholder="Contraseña" placeholderTextColor={isDark ? "#888" : "#999"} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={iniciarSesion}>
        <Text style={styles.buttonText}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/registro')}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate aquí</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, textAlign: 'center', color: '#007bff' }
});