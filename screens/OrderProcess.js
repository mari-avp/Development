import React, { useState, useContext, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
import Logo from '../ui/Logo'

// Importar AuthContext
import { AuthContext } from '../context/AuthContext'

export default function OrderProcess({ navigation }) {
  const [loading, setLoading] = useState(false)

  // Obtener conductorId desde el contexto de autenticación
  const { state: authState } = useContext(AuthContext)
  const idConductor = authState?.conductorId

  // Validación inicial
  useEffect(() => {
    if (!idConductor) {
      console.error('ID del conductor no encontrado en el contexto')
    }
  }, [idConductor])

  const fetchIdOrden = async (idConductor, estado) => {
    try {
      setLoading(true)

      const response = await fetch(
        `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/${idConductor}/ordenes`
      )

      // Ignorar errores 404 y continuar
      if (response.status === 404) {
        console.log(
          'Respuesta 404: No se encontraron órdenes, pero continuando.'
        )
        return null // Devuelve null para manejar el caso sin interrumpir el flujo
      }

      // Si hay otro error que no sea 404, lánzalo
      if (!response.ok) {
        throw new Error(
          `Error en la respuesta del servidor: ${response.statusText}`
        )
      }

      const data = await response.json()
      console.log('Respuesta del endpoint:', data) // Verificar la respuesta completa

      // Buscar la orden con el estado especificado
      const order = data.find((order) => order.estado === estado)

      if (order && order.id) {
        console.log(`idOrden obtenido con estado=${estado}:`, order.id)
        return order.id
      } else {
        console.log(`No se encontró ninguna orden con estado=${estado}.`)
        return null // Devuelve null si no se encuentra una orden válida
      }
    } catch (error) {
      console.error('Error al obtener el idOrden:', error)
      return null // Devuelve null para manejar errores no críticos
    } finally {
      setLoading(false)
    }
  }

  const localizarOrden = async () => {
    if (!idConductor) {
      Alert.alert('Error', 'No se encontró el ID del conductor.')
      return
    }

    try {
      const idOrden = await fetchIdOrden(idConductor, 1) // Buscar orden con estado=1

      if (!idOrden || typeof idOrden !== 'string') {
        Alert.alert('Error', 'No se pudo obtener un idOrden válido.')
        return
      }

      console.log('idOrden a enviar para marcar como localizada:', idOrden)

      const url = `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/Localizada/${idOrden}`
      console.log('URL generada para Localizar:', url)

      const response = await fetch(url, {
        method: 'PUT', // Método PUT requerido por el servidor
      })

      if (response.ok) {
        Alert.alert(
          'Éxito',
          'La orden fue marcada como localizada correctamente.'
        )
        console.log('Orden marcada como localizada exitosamente:', idOrden)
      } else {
        const errorDetails = await response.text()
        console.error('Error en la respuesta:', response.status, errorDetails)
        Alert.alert(
          'Error',
          `Hubo un problema al localizar la orden. Código: ${response.status}`
        )
      }
    } catch (error) {
      console.error('Error al localizar la orden:', error)
      Alert.alert('Error', 'No se pudo completar la acción.', error)
    }
  }

  const finalizarOrden = async () => {
    if (!idConductor) {
      Alert.alert('Error', 'No se encontró el ID del conductor.')
      return
    }

    try {
      const idOrden = await fetchIdOrden(idConductor, 2) // Buscar orden con estado=2

      if (!idOrden || typeof idOrden !== 'string') {
        Alert.alert('Error', 'No se pudo obtener un idOrden válido.')
        return
      }

      console.log('idOrden enviado al servidor para finalizar:', idOrden)

      const url = `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/finalizar/${idOrden}`
      console.log('URL generada:', url)

      const response = await fetch(url, {
        method: 'PUT', // Método PUT requerido por el servidor
      })

      if (response.ok) {
        Alert.alert('Éxito', 'La orden fue finalizada correctamente.')
        console.log('Orden finalizada con éxito:', idOrden)
        navigation.navigate('Dashboard') // Redirige o realiza otra acción
      } else {
        const errorDetails = await response.text()
        console.error('Error en la respuesta:', response.status, errorDetails)
        Alert.alert(
          'Error',
          `Hubo un problema al finalizar la orden. Código: ${response.status}`
        )
      }
    } catch (error) {
      console.error('Error al finalizar la orden:', error)
      Alert.alert('Error', 'No se pudo completar la acción.', error)
    }
  }

  const cancelarOrden = async () => {
    if (!idConductor) {
      Alert.alert('Error', 'No se encontró el ID del conductor.')
      return
    }

    try {
      const idOrden = await fetchIdOrden(idConductor, 1) // Buscar orden con estado=1 para cancelar

      if (!idOrden || typeof idOrden !== 'string') {
        Alert.alert(
          'Error',
          'No se pudo obtener un idOrden válido para cancelar.'
        )
        return
      }

      console.log('idOrden enviado al servidor para cancelar:', idOrden)

      const url = `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/cancelar/${idOrden}`
      console.log('URL generada:', url)

      const response = await fetch(url, {
        method: 'PUT', // Método PUT requerido por el servidor
      })

      if (response.ok) {
        Alert.alert('Éxito', 'La orden fue cancelada correctamente.')
        console.log('Orden cancelada con éxito:', idOrden)
      } else {
        const errorDetails = await response.text()
        console.error('Error en la respuesta:', response.status, errorDetails)
        Alert.alert(
          'Error',
          `Hubo un problema al cancelar la orden. Código: ${response.status}`
        )
      }
    } catch (error) {
      console.error('Error al cancelar la orden:', error)
      Alert.alert('Error', 'No se pudo completar la acción.', error)
    }
  }

  if (!idConductor) {
    return (
      <Background>
        <Logo />
        <Header>Órdenes en Proceso</Header>
        <Text style={{ textAlign: 'center', marginVertical: 20 }}>
          No se encontró el ID del conductor. Por favor, inicia sesión.
        </Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </Background>
    )
  }

  if (loading) {
    return (
      <Background>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </Background>
    )
  }

  return (
    <Background>
      <Logo />
      <Header>Órdenes en Proceso</Header>

      <View style={styles.centeredButtonContainer}>
        {/* Botón Localizado */}
        <TouchableOpacity
          style={styles.buttonNormal}
          onPress={localizarOrden} // Llama a localizarOrden al presionar
        >
          <Text style={styles.buttonText}>Localizado</Text>
        </TouchableOpacity>

        {/* Botón Costos Extras */}
        <TouchableOpacity
          style={styles.buttonNormal}
          onPress={() => navigation.navigate('AddCost')}
        >
          <Text style={styles.buttonText}>Costos Extras</Text>
        </TouchableOpacity>

        {/* Botón Ubicación Orden */}
        <TouchableOpacity
          style={styles.buttonNormal}
          onPress={() => navigation.navigate('ServiceOrder')}
        >
          <Text style={styles.buttonText}>Ubicación Orden</Text>
        </TouchableOpacity>

        {/* Botón Finalizar */}
        <TouchableOpacity style={styles.buttonNormal} onPress={finalizarOrden}>
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>

        {/* Botón Cancelar */}
        <TouchableOpacity style={styles.buttonCancel} onPress={cancelarOrden}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={() => navigation.goBack()}>
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  centeredButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonNormal: {
    backgroundColor: '#4CAF50', // Color verde
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonCancel: {
    backgroundColor: '#F44336', // Color rojo para cancelar
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '80%',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
})

export { OrderProcess }
