import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../lib/supabase';

// Definimos la estructura del objeto Gasto
interface Gasto {
  id: number;
  categoria: string;
  monto: number;
}

export default function MisGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGastos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: false });

      if (error) throw error;
      
      // El "as Gasto[]" ayuda a eliminar los subrayados de TypeScript
      setGastos((data as Gasto[]) || []);
    } catch (error) {
      console.error('Error al cargar gastos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Se ejecuta cada vez que entras a la pantalla
  useFocusEffect(
    useCallback(() => {
      fetchGastos();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGastos();
  }, []);

  const renderItem = ({ item }: { item: Gasto }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.categoria}>{item.categoria}</Text>
      </View>
      <Text style={styles.monto}>S/{item.monto.toFixed(2)}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  return (
    <FlatList
      data={gastos}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Aún no tienes gastos registrados.</Text>
      }
    />
  );
}

// DEFINICIÓN DE ESTILOS (Aquí es donde se soluciona el error)
const styles = StyleSheet.create({
  listContainer: { 
    padding: 15 
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center' 
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Sombra para Android
    elevation: 3,
  },
  categoria: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  monto: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#007bff' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: '#888' 
  }
});