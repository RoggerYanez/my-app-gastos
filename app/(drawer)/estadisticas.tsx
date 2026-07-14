import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import { supabase } from '../../lib/supabase';

export default function Estadisticas() {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width - 40;

  const fetchEstadisticas = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('gastos')
      .select('categoria, monto')
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // --- LÓGICA DE NORMALIZACIÓN Y AGRUPADO ---
    const agrupado = data.reduce((acc: any, curr: any) => {
      // 1. Limpiamos: Quitamos espacios y minúsculas para comparar
      const rawCat = curr.categoria || 'Otros';
      const cleanCat = rawCat.trim().toLowerCase();
      // 2. Capitalizamos: Primera letra mayúscula para mostrar
      const cat = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1);
      
      acc[cat] = (acc[cat] || 0) + Number(curr.monto);
      return acc;
    }, {});

    // Preparar colores
    const colores = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

    // 3. Formatear datos para los gráficos
    const etiquetas = Object.keys(agrupado);
    const valores = Object.values(agrupado) as number[];

    const pieData = etiquetas.map((cat, index) => ({
      name: cat,
      population: agrupado[cat],
      color: colores[index % colores.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }));

    setChartData({
      pie: pieData,
      bar: { labels: etiquetas, datasets: [{ data: valores }] },
      line: { labels: etiquetas, datasets: [{ data: valores }] }
    });

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchEstadisticas();
    }, [])
  );

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    decimalPlaces: 0,
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <Text style={styles.title}>Mis Estadísticas</Text>

      {chartData ? (
        <>
          <Text style={styles.subtitle}>Distribución (%)</Text>
          <PieChart data={chartData.pie} width={screenWidth} height={200} chartConfig={chartConfig} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"15"} />

          <Text style={styles.subtitle}>Comparativa por Categoría</Text>
          <BarChart data={chartData.bar} width={screenWidth} height={220} chartConfig={chartConfig} yAxisLabel="S/" />

          <Text style={styles.subtitle}>Tendencia</Text>
          <LineChart data={chartData.line} width={screenWidth} height={220} chartConfig={chartConfig} yAxisLabel="S/" />
        </>
      ) : (
        <Text style={{ textAlign: 'center' }}>No hay suficientes datos</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, fontWeight: '600', marginTop: 30, marginBottom: 10 }
});