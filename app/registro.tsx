import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';

  async function registrar() {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, username: username, email: email }]);
      if (profileError) {
        Alert.alert('Error creando perfil', profileError.message);
      } else {
        Alert.alert('Éxito', 'Cuenta creada. Ya puedes iniciar sesión.');
        router.back();
      }
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Crear Cuenta</Text>
      
      <TextInput style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd' }]} placeholder="Nombre de usuario" placeholderTextColor={isDark ? "#888" : "#999"} value={username} onChangeText={setUsername} />
      <TextInput style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd' }]} placeholder="Email" placeholderTextColor={isDark ? "#888" : "#999"} value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd' }]} placeholder="Password" placeholderTextColor={isDark ? "#888" : "#999"} value={password} onChangeText={setPassword} secureTextEntry />
      
      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>CREAR CUENTA</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Volver a Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 15, color: '#007bff', textAlign: 'center' }
});