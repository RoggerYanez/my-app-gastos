import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MisGastos() {
  const [gastos, setGastos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Detectar el modo del sistema (dark/light)
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    fetchGastos();
  }, []);

  async function fetchGastos() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user.id)
      .order('fecha', { ascending: false });

    if (error) {
      Alert.alert("Error", "No se pudieron cargar los gastos");
      console.error(error);
    } else {
      setGastos(data || []);
    }
    setLoading(false);
  }

  const togglePago = async (id: number, currentStatus: boolean) => {
    const { error } = await supabase
      .from('gastos')
      .update({ estado_pago: !currentStatus })
      .eq('id', id);

    if (error) {
      Alert.alert("Error", "No se pudo actualizar el estado");
    } else {
      fetchGastos();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { 
      borderLeftColor: item.estado_pago ? '#28a745' : '#dc3545',
      backgroundColor: isDark ? '#1e1e1e' : '#fff' 
    }]}>
      <View style={styles.cardContent}>
        <View>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{item.categoria}</Text>
          <Text style={[styles.date, { color: isDark ? '#ccc' : '#666' }]}>{new Date(item.fecha).toLocaleDateString()}</Text>
        </View>
        <Text style={styles.amount}>S/{item.monto}</Text>
      </View>
      <TouchableOpacity onPress={() => togglePago(item.id, item.estado_pago)}>
        <MaterialCommunityIcons 
          name={item.estado_pago ? "checkbox-marked" : "checkbox-blank-outline"} 
          size={28} 
          color={item.estado_pago ? "#28a745" : (isDark ? "#aaa" : "#ccc")} 
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <FlatList
        data={gastos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={fetchGastos}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: { padding: 15 },
  card: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginRight: 15 },
  title: { fontSize: 18, fontWeight: 'bold' },
  date: { fontSize: 14 },
  amount: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
});