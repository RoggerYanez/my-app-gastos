import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';

export default function Estadisticas() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isDark = useColorScheme() === 'dark';
  const screenWidth = Dimensions.get('window').width - 40;

  const fetchEstadisticas = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('gastos').select('categoria, monto, fecha, estado_pago').eq('user_id', user.id);
    if (!data) { setLoading(false); return; }

    const now = new Date();
    const currentMonth = now.getMonth();
    let totalPagado = 0, totalPendiente = 0;
    const porCategoria: any = {};
    data.forEach((gasto: any) => {
      const date = new Date(gasto.fecha);
      if (date.getMonth() === currentMonth) {
        const monto = Number(gasto.monto);
        if (gasto.estado_pago) totalPagado += monto; else totalPendiente += monto;
        if (!porCategoria[gasto.categoria]) porCategoria[gasto.categoria] = 0;
        porCategoria[gasto.categoria] += monto;
      }
    });
    setStats({ totalPagado, totalPendiente, totalGeneral: totalPagado + totalPendiente, porCategoria });
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchEstadisticas(); }, []));

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  const chartConfig = {
    backgroundColor: isDark ? '#121212' : '#fff',
    backgroundGradientFrom: isDark ? '#121212' : '#fff',
    backgroundGradientTo: isDark ? '#121212' : '#fff',
    color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Resumen del Mes</Text>
      
      <View style={[styles.summaryBox, { backgroundColor: isDark ? '#1e1e1e' : '#e3f2fd' }]}>
        <Text style={{color: isDark ? '#fff' : '#007bff', fontWeight: 'bold'}}>Total Comprometido</Text>
        <Text style={[styles.summaryValue, { color: isDark ? '#fff' : '#000' }]}>S/ {stats.totalGeneral.toFixed(2)}</Text>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.summaryBoxHalf, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
          <Text style={{color: '#28a745', fontWeight: 'bold'}}>Ya Pagado</Text>
          <Text style={[styles.summaryValue, { color: isDark ? '#fff' : '#000' }]}>S/ {stats.totalPagado.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryBoxHalf, { backgroundColor: isDark ? '#1e1e1e' : '#f8f9fa' }]}>
          <Text style={{color: '#dc3545', fontWeight: 'bold'}}>Pendiente</Text>
          <Text style={[styles.summaryValue, { color: isDark ? '#fff' : '#000' }]}>S/ {stats.totalPendiente.toFixed(2)}</Text>
        </View>
      </View>

      <Text style={[styles.subtitle, { color: isDark ? '#fff' : '#000' }]}>Estado de Pagos</Text>
      <PieChart data={[{ name: 'Pagado', population: stats.totalPagado, color: '#28a745', legendFontColor: isDark ? '#fff' : '#7F7F7F' }, { name: 'Pendiente', population: stats.totalPendiente, color: '#dc3545', legendFontColor: isDark ? '#fff' : '#7F7F7F' }]} width={screenWidth} height={180} chartConfig={chartConfig} accessor="population" backgroundColor="transparent" paddingLeft="15" />

      <Text style={[styles.subtitle, { color: isDark ? '#fff' : '#000' }]}>Distribución por Categoría</Text>
      <BarChart data={{ labels: Object.keys(stats.porCategoria), datasets: [{ data: Object.values(stats.porCategoria) }] }} width={screenWidth} height={220} yAxisLabel="S/" chartConfig={chartConfig} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20 }, title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }, subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 }, rowContainer: { flexDirection: 'row', justifyContent: 'space-between' }, summaryBox: { alignItems: 'center', padding: 20, borderRadius: 15, width: '100%' }, summaryBoxHalf: { alignItems: 'center', padding: 15, borderRadius: 10, width: '48%' }, summaryValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 } });