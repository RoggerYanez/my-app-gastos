import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalado @expo/vector-icons
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface Gasto {
  id: number;
  categoria: string;
  monto: number;
  fecha: string; // Fecha de creación
  fecha_vencimiento: string | null;
  estado_pago: boolean;
}

export default function MisGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGastos = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    if (error) console.error(error);
    setGastos(data || []);
  };

  const togglePago = async (id: number, estadoActual: boolean) => {
    const { error } = await supabase
      .from('gastos')
      .update({ estado_pago: !estadoActual })
      .eq('id', id);

    if (error) Alert.alert('Error', 'No se pudo actualizar el estado');
    else fetchGastos(); // Recargamos la lista
  };

  useFocusEffect(useCallback(() => { fetchGastos(); }, []));

  return (
    <FlatList
      data={gastos}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchGastos} />}
      renderItem={({ item }) => (
        <View style={[styles.card, { borderColor: item.estado_pago ? '#28a745' : '#dc3545', borderLeftWidth: 5 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.categoria}>{item.categoria}</Text>
            {/* Lógica: Si hay vencimiento, mostrarlo; si no, mostrar fecha de creación */}
            <Text style={styles.fecha}>
              {item.fecha_vencimiento 
                ? `Vence: ${new Date(item.fecha_vencimiento).toLocaleDateString()}` 
                : new Date(item.fecha).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.monto}>S/{item.monto.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => togglePago(item.id, item.estado_pago)}>
              <Ionicons 
                name={item.estado_pago ? "checkbox" : "square-outline"} 
                size={24} 
                color={item.estado_pago ? "#28a745" : "#6c757d"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, margin: 10, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', elevation: 3 },
  categoria: { fontSize: 18, fontWeight: 'bold' },
  fecha: { color: '#666', fontSize: 12 },
  monto: { fontSize: 16, fontWeight: 'bold', color: '#007bff' }
});