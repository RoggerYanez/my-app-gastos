import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MiCuenta() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = supabase.auth.getUser();
    user.then(res => setEmail(res.data.user?.email || ''));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{email.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.email}>{email}</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>¡Hola! Bienvenido a tu gestor de gastos personal.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 50, backgroundColor: '#f9f9f9' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#007bff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, color: '#666', marginBottom: 20 },
  infoCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, width: '90%', elevation: 2 }
});