import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { supabase } from '../../lib/supabase';

function CustomDrawerContent(props: any) {
  const router = useRouter();

  return (
    <DrawerContentScrollView {...props}>
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
  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      {/* 'index' es el archivo principal (Registrar Gasto) */}
      <Drawer.Screen name="index" options={{ title: 'Registrar Gasto' }} />
      
      {/* Tus otras pantallas */}
      <Drawer.Screen name="gastos" options={{ title: 'Mis Gastos' }} />
      <Drawer.Screen name="estadisticas" options={{ title: 'Estadísticas' }} />
      <Drawer.Screen name="cuenta" options={{ title: 'Mi Cuenta' }} />
    </Drawer>
  );
}