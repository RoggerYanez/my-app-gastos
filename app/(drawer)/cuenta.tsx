import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MiCuenta() {
  const [email, setEmail] = useState('');
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email || '');
    };
    getUser();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f9f9f9' }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{email.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Mi Perfil</Text>
      <Text style={[styles.email, { color: isDark ? '#aaa' : '#666' }]}>{email}</Text>
      
      <View style={[styles.infoCard, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
        <Text style={{ color: isDark ? '#eee' : '#333' }}>¡Hola! Bienvenido a tu gestor de gastos personal.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 50 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#007bff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  email: { fontSize: 16, marginBottom: 20 },
  infoCard: { padding: 20, borderRadius: 15, width: '90%', elevation: 2 }
});