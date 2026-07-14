// CAMBIO IMPORTANTE: Importamos desde /legacy
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function HerramientasScreen() {

  const exportarDatos = async () => {
    try {
      console.log("1. Obteniendo datos...");
      const { data, error } = await supabase.from('gastos').select('*');
      
      if (error) throw new Error("Error en Supabase: " + error.message);

      if (!data || data.length === 0) {
        Alert.alert('Atención', 'No hay datos para exportar');
        return;
      }

      // 2. Formato CSV
      let csvContent = "ID,Categoria,Monto,Fecha,Estado\n";
      data.forEach(row => {
        csvContent += `${row.id},${row.categoria},${row.monto},${row.fecha},${row.estado_pago ? 'Pagado' : 'Pendiente'}\n`;
      });

      // 3. Obtener directorio y validar que exista
      const dir = FileSystem.documentDirectory;
      if (!dir) {
        throw new Error("No se pudo acceder al sistema de archivos del dispositivo.");
      }

      const path = `${dir}mis_gastos.csv`;
      
      console.log("3. Guardando archivo en:", path);
      await FileSystem.writeAsStringAsync(path, csvContent);

      // 4. Compartir
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (!isSharingAvailable) {
        throw new Error("El dispositivo no permite compartir archivos.");
      }

      await Sharing.shareAsync(path);
      console.log("5. Exportación exitosa.");

    } catch (error: any) {
      console.error("--- ERROR EN EXPORTACIÓN ---");
      console.error(error);
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Herramientas</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Exportar Gastos</Text>
        <Text style={styles.desc}>Descarga un archivo con todo tu historial de gastos.</Text>
        <TouchableOpacity style={styles.button} onPress={exportarDatos}>
          <Text style={styles.buttonText}>Descargar CSV</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 12, elevation: 3 },
  label: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  desc: { color: '#666', marginBottom: 15 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});