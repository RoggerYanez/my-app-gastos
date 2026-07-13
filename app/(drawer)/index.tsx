import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RegistrarGastoScreen() {
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const [loading, setLoading] = useState(false);

  const guardarGasto = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert('Error', 'No estás autenticado');
      return;
    }

    if (!categoria || !monto) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('gastos')
      .insert([{ categoria: categoria, monto: parseFloat(monto), user_id: user.id }]);

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Gasto guardado correctamente');
      setCategoria('');
      setMonto('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Nuevo Gasto</Text>
      <TextInput placeholder="Categoría" style={styles.input} onChangeText={setCategoria} value={categoria} />
      <TextInput placeholder="Monto" style={styles.input} keyboardType="numeric" onChangeText={setMonto} value={monto} />

      <TouchableOpacity style={styles.button} onPress={guardarGasto} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>GUARDAR GASTO</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 10 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});