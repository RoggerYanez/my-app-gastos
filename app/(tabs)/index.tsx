import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function App() {
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');

  const guardarGasto = async () => {
    const { error } = await supabase
      .from('gastos')
      .insert([{ categoria: categoria, monto: parseFloat(monto) }]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Éxito', 'Gasto guardado');
      setCategoria('');
      setMonto('');
    }
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Categoría" 
        style={styles.input} 
        onChangeText={setCategoria} 
        value={categoria} 
      />
      <TextInput 
        placeholder="Monto" 
        style={styles.input} 
        keyboardType="numeric" 
        onChangeText={setMonto} 
        value={monto} 
      />
      
      <Button title="Guardar Gasto" onPress={guardarGasto} />
      
      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar Sesión" onPress={cerrarSesion} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 15, 
    marginBottom: 15, 
    borderRadius: 8 
  }
});