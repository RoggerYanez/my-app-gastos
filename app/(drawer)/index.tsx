import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function RegistrarGasto() {
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Categoría</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ccc' }]}
        placeholder="Ej: Luz, Comida"
        placeholderTextColor={isDark ? '#888' : '#999'}
        value={categoria}
        onChangeText={setCategoria}
      />
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Monto</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ccc' }]}
        placeholder="0.00"
        placeholderTextColor={isDark ? '#888' : '#999'}
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Guardar Gasto</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, label: { marginBottom: 8, fontWeight: 'bold' }, input: { padding: 15, borderRadius: 8, borderWidth: 1, marginBottom: 20 }, button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' }, buttonText: { color: '#fff', fontWeight: 'bold' } });