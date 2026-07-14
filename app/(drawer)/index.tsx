import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RegistrarGasto() {
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const [esServicio, setEsServicio] = useState(false);
  const [fecha, setFecha] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!categoria || !monto) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Lógica: Si es servicio, usamos la fecha seleccionada. Si no, usamos hoy.
    const fechaFinal = esServicio ? fecha : new Date();

    const { error } = await supabase
      .from('gastos')
      .insert({
        user_id: user.id,
        categoria: categoria,
        monto: parseFloat(monto),
        es_servicio: esServicio,
        fecha_vencimiento: fechaFinal.toISOString()
      });

    if (error) {
      Alert.alert('Error', 'No se pudo guardar el gasto');
    } else {
      Alert.alert('Éxito', 'Gasto registrado');
      router.back(); // Regresa a la pantalla anterior
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categoría</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ej: Luz, Comida, Transporte"
        value={categoria}
        onChangeText={setCategoria}
      />

      <Text style={styles.label}>Monto (S/)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="0.00"
        keyboardType="numeric"
        value={monto}
        onChangeText={setMonto}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Es un servicio (Luz, Agua, Gas)?</Text>
        <Switch value={esServicio} onValueChange={setEsServicio} />
      </View>

      {esServicio && (
        <View style={styles.dateContainer}>
          <Text style={styles.label}>Fecha de vencimiento:</Text>
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateButton}>
            <Text>{fecha.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={fecha}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setFecha(selectedDate);
              }}
            />
          )}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 20 },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  dateContainer: { marginBottom: 20 },
  dateButton: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8, alignItems: 'center' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});