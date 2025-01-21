import React, { useState, useContext } from 'react'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import Background from '../ui/Background'
import Logo from '../ui/Logo'
import Header from '../ui/Header'
import Button from '../ui/Button'
import { useNavigation } from '@react-navigation/native'
import { AuthContext } from '../context/AuthContext' // Ajusta la ruta según sea necesario
import { theme } from '../core/theme'

export default function Dashboard({ navigation }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { signOut, state, getUserId } = useContext(AuthContext) // Accede al contexto

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
      <Button
        mode="outlined"
        onPress={toggleMenu}
        style={[{ marginTop: 20 }, styles.buttonStyle]}
      >
        Opciones
      </Button>

      {/* Menú Opciones */}
      {isMenuOpen && (
        <View style={styles.menu}>
          <Pressable
            style={[styles.menuItem, styles.menuItemButton]}
            onPress={() => handleNavigate('OrderComplete')}
          >
            <Text style={styles.menuItemText}>Order Complete</Text>
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemButton]}
            onPress={() => handleNavigate('OrderRejected')}
          >
            <Text style={styles.menuItemText}>Order Rejected</Text>
          </Pressable>

          <Pressable
            style={[styles.menuItem, styles.menuItemButton]}
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
        style={[{ marginTop: 20 }, styles.buttonStyle]}
      >
        Perfil
      </Button>

      {/* Botón Notificaciones */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('Notification')}
        style={[{ marginTop: 20 }, styles.buttonStyle]}
      >
        Notificaciones
      </Button>

      {/* Botón Órdenes de Servicio */}
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('ServiceOrder')}
        style={[{ marginTop: 20 }, styles.buttonStyle]}
      >
        Órdenes de Servicio
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.navigate('LocationScreen')}
        style={[{ marginTop: 20 }, styles.buttonStyle]}
      >
        Actualizar Ubi
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
    backgroundColor: '#ffffff',
    borderRadius: 16, // Bordes redondeados
    padding: 16, // Espaciado interno
    marginTop: 10,
    width: '90%', // Ocupa un porcentaje del ancho de la pantalla
    alignSelf: 'center', // Centra el menú en la pantalla
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6, // Sombra en Android
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10, // Bordes redondeados en los elementos del menú
    marginBottom: 10, // Espacio entre elementos
    backgroundColor: theme.colors.primary, // Fondo claro para los botones
  },
  menuItemButton: {
    backgroundColor: theme.colors.primary, // Fondo azul moderno
  },
  menuItemText: {
    fontSize: 16,
    color: '#ffffff', // Texto blanco
    fontWeight: '600',
    textAlign: 'center', // Centra el texto
  },
  buttonStyle: {
    justifyContent: 'center', // Centra el contenido verticalmente
    alignItems: 'center', // Centra el contenido horizontalmente
    paddingVertical: 12, // Espacio suficiente verticalmente
    paddingHorizontal: 20, // Espacio suficiente horizontalmente
    width: '80%', // Botón más ancho y centrado
    alignSelf: 'center', // Centra el botón en el contenedor
    borderRadius: 12, // Bordes redondeados para estética moderna
    marginVertical: 10, // Espaciado uniforme entre botones
  },
  containedButton: {
    backgroundColor: '#3498db', // Color del botón contenido
  },
  containedButtonText: {
    fontSize: 16,
    color: '#fff', // Texto blanco para botones contenidos
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto
  },
  outlinedButtonText: {
    fontSize: 16,
    color: '#3498db', // Color del texto en botones outlined
    fontWeight: 'bold',
    textAlign: 'center', // Centra el texto
  },
})

export { Dashboard }
