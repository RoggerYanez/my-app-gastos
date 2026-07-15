import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function IniciarSesion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function iniciarSesion() {
    // .trim() elimina espacios al inicio y al final
    const cleanUsername = username.trim();

    if (!cleanUsername || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    // Usamos el nombre limpio para buscar en la base de datos
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .ilike('username', cleanUsername) 
      .single();

    if (profileError || !profile) {
      Alert.alert('Error', 'Usuario no encontrado');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(drawer)');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Nombre de usuario" 
        value={username} 
        onChangeText={setUsername} 
        autoCapitalize="none"
        autoCorrect={false} // Recomendado para nombres de usuario
      />
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
      />
      
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
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ccc' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { marginTop: 20, textAlign: 'center', color: '#007bff', fontSize: 14, textDecorationLine: 'underline' }
});