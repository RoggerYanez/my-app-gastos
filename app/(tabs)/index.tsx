import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

// Estas variables vienen de tu archivo .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Inicializamos el cliente
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export default function App() {
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');

  const guardarGasto = async () => {
    // Esto es para ayudarte a diagnosticar. 
    // Mira tu terminal de VS Code al presionar el botón.
    console.log("URL de Supabase:", supabaseUrl);
    console.log("Anon Key de Supabase:", supabaseAnonKey);

    if (!supabase) {
      Alert.alert("Error", "No se detectaron las variables de entorno. Asegúrate de reiniciar el servidor con 'npx expo start -c'");
      return;
    }

    const { error } = await supabase
      .from('gastos') 
      .insert([{ categoria: categoria, monto: parseFloat(monto) }]);

    if (error) {
      Alert.alert('Error en Supabase', error.message);
    } else {
      Alert.alert('Éxito', '¡Gasto guardado correctamente!');
      setCategoria('');
      setMonto('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Gastos</Text>
      <TextInput 
        placeholder="Categoría" 
        style={styles.input} 
        onChangeText={setCategoria}
        value={categoria}
        placeholderTextColor="#888"
      />
      <TextInput 
        placeholder="Monto" 
        style={styles.input} 
        keyboardType="numeric"
        onChangeText={setMonto}
        value={monto}
        placeholderTextColor="#888"
      />
      <Button title="Guardar Gasto" onPress={guardarGasto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5,
    color: 'black', // Esto corrige que el texto sea invisible
    backgroundColor: 'white' // Asegura que el fondo permita ver el texto
  }
});