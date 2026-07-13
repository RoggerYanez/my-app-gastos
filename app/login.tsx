import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function iniciarSesion() {
    if (!email || !password) return Alert.alert("Error", "Completa todos los campos");
    
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
        secureTextEntry 
      />
      
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Iniciar Sesión" onPress={iniciarSesion} />
          <TouchableOpacity onPress={() => router.push('/register')} style={{marginTop: 20}}>
            <Text style={{textAlign: 'center', color: 'blue'}}>¿No tienes cuenta? Regístrate aquí</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 15, marginBottom: 15, borderRadius: 8, borderColor: '#ccc' }
});