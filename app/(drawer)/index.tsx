import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RegistrarGasto() {
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const [esServicio, setEsServicio] = useState(false);
  const [fechaVencimiento, setFechaVencimiento] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  
  const isDark = useColorScheme() === 'dark';

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setFechaVencimiento(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!categoria || !monto) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Lógica: Si es servicio enviamos fecha_vencimiento, si no, lo dejamos null
    const { error } = await supabase.from('gastos').insert({
      user_id: user.id,
      categoria: categoria,
      monto: parseFloat(monto),
      fecha: new Date().toISOString(), // Fecha de hoy (registro)
      fecha_vencimiento: esServicio ? fechaVencimiento.toISOString() : null,
      estado_pago: false
    });

    if (error) {
      Alert.alert('Error', 'No se pudo guardar.');
    } else {
      Alert.alert('Éxito', 'Gasto registrado');
      setCategoria(''); setMonto(''); setEsServicio(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Categoría</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd' }]} 
        placeholder="Ej: Luz, Comida" 
        placeholderTextColor={isDark ? "#888" : "#999"}
        value={categoria} 
        onChangeText={setCategoria} 
      />

      <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Monto (S/)</Text>
      <TextInput 
        style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ddd' }]} 
        placeholder="0.00" 
        placeholderTextColor={isDark ? "#888" : "#999"}
        keyboardType="numeric" 
        value={monto} 
        onChangeText={setMonto} 
      />

      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: isDark ? '#fff' : '#000', marginBottom: 0 }]}>¿Es servicio?</Text>
        <Switch value={esServicio} onValueChange={setEsServicio} />
      </View>

      {/* Selector de fecha solo si es servicio */}
      {esServicio && (
        <View style={{ marginBottom: 20 }}>
          <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>Fecha de Vencimiento</Text>
          <TouchableOpacity 
            style={[styles.dateButton, { backgroundColor: isDark ? '#1e1e1e' : '#f0f0f0', borderColor: isDark ? '#444' : '#ddd' }]} 
            onPress={() => setShowPicker(true)}
          >
            <Text style={{ color: isDark ? '#fff' : '#000' }}>{fechaVencimiento.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={fechaVencimiento}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar Gasto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '600' },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 20 },
  dateButton: { borderWidth: 1, padding: 15, borderRadius: 8, alignItems: 'center' },
  switchContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});