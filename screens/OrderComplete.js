import React, { useState, useEffect, useContext } from 'react'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
import Logo from '../ui/Logo'
import { FlatList, Text, StyleSheet, View } from 'react-native'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function OrderComplete({ navigation }) {
  const { getConductorId, isLoadingConductorId } = useContext(AuthContext) // Obtener conductorId desde el contexto
  const [orders, setOrders] = useState([]) // Lista de órdenes
  const [loading, setLoading] = useState(true) // Estado de carga
  const [error, setError] = useState(null) // Manejo de errores

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (isLoadingConductorId) {
          console.log('Esperando a que el conductorId esté disponible...')
          return // Espera a que el conductorId esté listo
        }

        const conductorId = getConductorId()
        console.log(
          'Valor de conductorId obtenido con getConductorId:',
          conductorId
        )

        if (!conductorId) {
          throw new Error('El conductorId no está disponible.')
        }

        console.log(
          'Enviando solicitud al endpoint /OrdenDeServicio/{conductorId}/ordenes con conductorId:',
          conductorId
        )

        const response = await axios.get(
          `https://f8b4-2a0d-5600-4f-7000-29f2-3ec5-bdd0-7fe0.ngrok-free.app/api/OrdenDeServicio/${conductorId}/ordenes`
        )

        console.log('Órdenes obtenidas:', response.data)
        setOrders(response.data) // Almacena las órdenes en el estado
      } catch (err) {
        console.error('Error al obtener las órdenes:', err.message)
        setError(err.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [getConductorId, isLoadingConductorId])

  if (loading || isLoadingConductorId) {
    return (
      <Background>
        <Text>Cargando órdenes completadas...</Text>
      </Background>
    )
  }

  if (error) {
    return (
      <Background>
        <Text>Error: {error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Volver
        </Button>
      </Background>
    )
  }

  return (
    <Background>
      <Logo />
      <Header>Órdenes Completadas</Header>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{`Orden ID: ${item.id}`}</Text>
            <Text
              style={styles.itemText}
            >{`Fecha: ${item.fecha || 'N/A'}`}</Text>
            <Text
              style={styles.itemText}
            >{`Estado: ${item.estado || 'N/A'}`}</Text>
            <Text
              style={styles.itemText}
            >{`Cliente: ${item.cliente || 'N/A'}`}</Text>
            <Text
              style={styles.itemText}
            >{`Monto: ${item.monto || 'N/A'}`}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay órdenes completadas.</Text>
        }
      />
      {/* Botón para regresar */}
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
})

export { OrderComplete }
