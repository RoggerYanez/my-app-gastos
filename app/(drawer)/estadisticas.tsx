import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';

export default function Estadisticas() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width - 40;

  const fetchEstadisticas = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('gastos')
      .select('categoria, monto, fecha, estado_pago')
      .eq('user_id', user.id);

    if (error || !data) { setLoading(false); return; }

    const now = new Date();
    const currentMonth = now.getMonth();

    let totalPagado = 0;
    let totalPendiente = 0;
    const porCategoria: any = {};

    data.forEach((gasto: any) => {
      const date = new Date(gasto.fecha);
      if (date.getMonth() === currentMonth) {
        const monto = Number(gasto.monto);
        
        if (gasto.estado_pago) totalPagado += monto;
        else totalPendiente += monto;

        if (!porCategoria[gasto.categoria]) porCategoria[gasto.categoria] = 0;
        porCategoria[gasto.categoria] += monto;
      }
    });

    setStats({ 
      totalPagado, 
      totalPendiente, 
      totalGeneral: totalPagado + totalPendiente, 
      porCategoria 
    });
    setLoading(false);
  };

  useFocusEffect(useCallback(() => { fetchEstadisticas(); }, []));

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  const pieData = [
    { name: 'Pagado', population: stats.totalPagado, color: '#28a745', legendFontColor: '#7F7F7F' },
    { name: 'Pendiente', population: stats.totalPendiente, color: '#dc3545', legendFontColor: '#7F7F7F' }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Resumen del Mes</Text>

      {/* 1. TARJETA PRINCIPAL: PRESUPUESTO TOTAL */}
      <View style={[styles.summaryBox, { backgroundColor: '#e3f2fd', marginBottom: 15 }]}>
        <Text style={{color: '#007bff', fontWeight: 'bold'}}>Total Comprometido</Text>
        <Text style={[styles.summaryValue, { fontSize: 26 }]}>S/ {stats.totalGeneral.toFixed(2)}</Text>
      </View>

      {/* 2. TARJETAS SECUNDARIAS: AVANCE */}
      <View style={styles.rowContainer}>
        <View style={styles.summaryBoxHalf}>
          <Text style={{color: '#28a745', fontWeight: 'bold'}}>Ya Pagado</Text>
          <Text style={styles.summaryValue}>S/ {stats.totalPagado.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBoxHalf}>
          <Text style={{color: '#dc3545', fontWeight: 'bold'}}>Pendiente</Text>
          <Text style={styles.summaryValue}>S/ {stats.totalPendiente.toFixed(2)}</Text>
        </View>
      </View>

      {/* 3. GRÁFICOS */}
      <Text style={styles.subtitle}>Estado de Pagos (Visual)</Text>
      <PieChart
        data={pieData}
        width={screenWidth}
        height={180}
        chartConfig={{ color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})` }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      <Text style={styles.subtitle}>Distribución por Categoría</Text>
      <BarChart
        data={{
          labels: Object.keys(stats.porCategoria),
          datasets: [{ data: Object.values(stats.porCategoria) }]
        }}
        width={screenWidth}
        height={220}
        yAxisLabel="S/"
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  rowContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryBox: { alignItems: 'center', padding: 20, borderRadius: 15, width: '100%' },
  summaryBoxHalf: { alignItems: 'center', backgroundColor: '#f8f9fa', padding: 15, borderRadius: 10, width: '48%' },
  summaryValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 }
});