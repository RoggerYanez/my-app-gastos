import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MiCuenta() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || '');
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/iniciar_sesion');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{email.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.label}>Correo Electrónico:</Text>
        <Text style={styles.email}>{email}</Text>
        
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', width: '100%', padding: 30, borderRadius: 20, alignItems: 'center', elevation: 5 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007bff', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  email: { fontSize: 18, fontWeight: 'bold', marginBottom: 30 },
  logoutButton: { backgroundColor: '#ff4d4d', paddingVertical: 12, paddingHorizontal: 40, borderRadius: 10 },
  logoutText: { color: '#fff', fontWeight: 'bold' }
});