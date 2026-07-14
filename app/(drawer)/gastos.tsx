import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

interface Gasto {
  id: number;
  categoria: string;
  monto: number;
  fecha: string;
  fecha_vencimiento: string | null;
  estado_pago: boolean;
}

export default function MisGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGastos = async () => {
    setRefreshing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      if (error) throw error;
      setGastos(data || []);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      Alert.alert('Error', 'No se pudieron cargar los gastos');
    } finally {
      setRefreshing(false);
    }
  };

  const togglePago = async (id: number, estadoActual: boolean) => {
    const nuevoEstado = !estadoActual;
    
    // 1. Cambio optimista (UI)
    setGastos(prev => prev.map(g => g.id === id ? { ...g, estado_pago: nuevoEstado } : g));

    // 2. Ejecución en base de datos
    const { error } = await supabase
      .from('gastos')
      .update({ estado_pago: nuevoEstado })
      .eq('id', id);

    // 3. Verificación de error
    if (error) {
      console.error("ERROR CRÍTICO AL ACTUALIZAR:", error); // <-- MIRA ESTO EN LA CONSOLA
      Alert.alert('Error', 'No tienes permiso para actualizar este gasto. Revisa tus políticas RLS.');
      // Revertimos
      setGastos(prev => prev.map(g => g.id === id ? { ...g, estado_pago: estadoActual } : g));
    } else {
      console.log("Cambio guardado exitosamente en Supabase");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGastos();
    }, [])
  );

  return (
    <FlatList
      data={gastos}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchGastos} />}
      renderItem={({ item }) => (
        <View style={[styles.card, { borderColor: item.estado_pago ? '#28a745' : '#dc3545', borderLeftWidth: 6 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.categoria}>{item.categoria}</Text>
            <Text style={styles.fecha}>{item.fecha_vencimiento ? `Vence: ${new Date(item.fecha_vencimiento).toLocaleDateString()}` : new Date(item.fecha).toLocaleDateString()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <Text style={styles.monto}>S/{Number(item.monto).toFixed(2)}</Text>
            <TouchableOpacity onPress={() => togglePago(item.id, item.estado_pago)} style={{padding: 5}}>
              <Ionicons 
                name={item.estado_pago ? "checkbox" : "square-outline"} 
                size={28} 
                color={item.estado_pago ? "#28a745" : "#6c757d"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No hay gastos registrados.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 15, marginHorizontal: 10, marginVertical: 6, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', elevation: 3 },
  categoria: { fontSize: 18, fontWeight: 'bold' },
  fecha: { color: '#666', fontSize: 12, marginTop: 4 },
  monto: { fontSize: 16, fontWeight: 'bold', color: '#007bff' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' }
});