import React, { useState, useContext } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Background from '../amparito/Background'
import Logo from '../amparito/Logo'
import Header from '../amparito/Header'
import Button from '../amparito/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext' // Ajusta la ruta según sea necesario

export default function Dashboard({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { signOut } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await signOut()
      navigation.reset({
        index: 0,
        routes: [{ name: 'SigninScreen' }],
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      Alert.alert('Error', 'No se pudo cerrar la sesión. Inténtelo de nuevo.')
    }
  }
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleNavigate = (screenName) => {
    setIsMenuOpen(false)
    navigation.navigate(screenName)
  }

  return (
    <Background>
      <Logo />
      <Header>Dashboard General</Header>

      {/* Botón para abrir/cerrar menú */}
      <Button mode="outlined" onPress={toggleMenu}>
        Opciones
      </Button>

      {/* Menú Opciones */}
      {isMenuOpen && (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => handleNavigate('OrderComplete')}
          >
            <Text style={styles.menuItemText}>Order Complete</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handleNavigate('OrderRejected')}
          >
            <Text style={styles.menuItemText}>Order Rejected</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => handleNavigate('OrderProcess')}
          >
            <Text style={styles.menuItemText}>Order Process</Text>
          </Pressable>
        </View>
      )}

      {/* Botón Perfil */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Perfil')}
        style={{ marginTop: 20 }}
      >
        Perfil
      </Button>

      {/* Botón Notificaciones */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Notification')}
        style={{ marginTop: 20 }}
      >
        Notificaciones
      </Button>

      {/* Botón Órdenes de Servicio */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('ServiceOrder')}
        style={{ marginTop: 20 }}
      >
        Órdenes de Servicio
      </Button>

      {/* Botón para cerrar sesión */}
      <Button mode="contained" onPress={handleLogout} style={{ marginTop: 20 }}>
        Cerrar Sesión
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  menu: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    width: 200,
    position: 'absolute',
    zIndex: 1000, // Para asegurarte de que aparezca por encima de otros elementos
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    // 'cursor: pointer' no existe en RN. Para un efecto "clickable",
    // Pressable/TouachableOpacity manejan la interactividad.
  },
  menuItemText: {
    fontSize: 16,
  },
})

export { Dashboard }
