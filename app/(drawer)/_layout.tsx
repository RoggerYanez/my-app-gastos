import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'react-native';
import { supabase } from '../../lib/supabase';

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const isDark = useColorScheme() === 'dark';
  
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: isDark ? '#121212' : '#fff' }}>
      <DrawerItemList {...props} />
      <DrawerItem 
        label="Cerrar Sesión" 
        onPress={async () => {
          await supabase.auth.signOut();
          router.replace('/iniciar_sesion');
        }}
        inactiveTintColor="red"
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const isDark = useColorScheme() === 'dark';

  return (
    <Drawer 
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? '#121212' : '#fff' }, // Fondo superior
        headerTintColor: isDark ? '#fff' : '#000', // Color del texto del título
        drawerStyle: { backgroundColor: isDark ? '#121212' : '#fff' }, // Fondo menú
        drawerActiveTintColor: isDark ? '#fff' : '#007bff',
        drawerInactiveTintColor: isDark ? '#aaa' : '#666',
      }}
    >
      <Drawer.Screen name="index" options={{ title: 'Registrar Gasto' }} />
      <Drawer.Screen name="gastos" options={{ title: 'Mis Gastos' }} />
      <Drawer.Screen name="estadisticas" options={{ title: 'Estadísticas' }} />
      <Drawer.Screen name="herramientas" options={{ title: 'Herramientas' }} />
      <Drawer.Screen name="cuenta" options={{ title: 'Mi Cuenta' }} />
    </Drawer>
  );
}