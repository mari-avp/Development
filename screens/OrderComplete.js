import React, { useEffect, useState, useContext } from 'react'
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native'
import Background from '../ui/Background'
import Header from '../ui/Header'
import Button from '../ui/Button'
import { db } from '../firebase'
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc, // Ensure this is imported
} from 'firebase/firestore'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'

export default function OrderComplete({ navigation }) {
  const [solicitudes, setSolicitudes] = useState([])
  const { state: authState, getConductorId } = useContext(AuthContext)

  // Fetch orders assigned to the conductor
  const fetchConductorOrders = async (conductorId) => {
    try {
      const response = await axios.get(
        `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/Conductor/${conductorId}`
      )

      // Verifica si hay datos antes de continuar
      if (response.status === 200) {
        console.log('Órdenes asignadas al conductor:', response.data)
        return response.data
      } else if (response.status === 404) {
        // Si es 404, ignorar el error
        console.log('No se encontraron órdenes asignadas al conductor.')
        return []
      } else {
        throw new Error(`Error inesperado: ${response.status}`)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // Ignorar silenciosamente errores 404
        console.log('No se encontraron órdenes. Código de respuesta: 404')
        return []
      }

      // Otros errores deben manejarse adecuadamente
      console.error(
        'Error al consultar órdenes del conductor:',
        error.response?.data || error.message
      )
      return []
    }
  }

  // Fetch order information
  const fetchOrdenInfo = async (idOrden) => {
    try {
      console.log(`Obteniendo información para IdOrden: ${idOrden}`)
      const response = await axios.get(
        `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/${idOrden}`
      )
      if (response.status === 200) {
        console.log(
          `Información recibida para IdOrden ${idOrden}:`,
          response.data
        )
        return {
          ubicacionIncidente: response.data.ubicacionIncidente,
          ubicacionDestino: response.data.ubicacionDestino,
        }
      } else {
        console.error(
          `Error al obtener información para IdOrden ${idOrden}:`,
          response.status
        )
        return {
          ubicacionIncidente: 'No disponible',
          ubicacionDestino: 'No disponible',
        }
      }
    } catch (error) {
      console.error(
        `Error al llamar al endpoint para IdOrden ${idOrden}:`,
        error.message
      )
      return { ubicacionIncidente: 'Error', ubicacionDestino: 'Error' }
    }
  }

  useEffect(() => {
    const conductorId = getConductorId()
    if (!conductorId) return

    fetchConductorOrders(conductorId)

    const fetchSolicitudes = async () => {
      const q = query(
        collection(db, 'Solicitudes'),
        where('IdConductor', '==', conductorId),
        where('Estado', '==', 'Pendiente')
      )
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const solicitudesData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data()

            if (!data.IdOrden) {
              console.warn(`Solicitud ${doc.id} no tiene un IdOrden válido.`)
              return { id: doc.id, ...data }
            }

            const ordenInfo = await fetchOrdenInfo(data.IdOrden)
            return {
              id: doc.id,
              ...data,
              ...ordenInfo,
            }
          })
        )
        setSolicitudes(solicitudesData)
      })
      return unsubscribe
    }

    const unsubscribe = fetchSolicitudes()
    return () => unsubscribe
  }, [getConductorId])

  // Accept request
  const handleAccept = async (idConductor, idOrden, solicitudId) => {
    try {
      await fetchConductorOrders(idConductor)

      const response = await axios.post(
        'https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/Asignar',
        {
          ordenId: idOrden,
          conductorId: idConductor,
        }
      )

      if (response.status === 200) {
        await deleteDoc(doc(db, 'Solicitudes', solicitudId))

        Alert.alert('Éxito', 'La orden ha sido asignada correctamente.', [
          { text: 'OK', onPress: () => navigation.navigate('ServiceOrder') },
        ])
      } else {
        Alert.alert('Error', 'No se pudo asignar la orden.')
      }
    } catch (error) {
      console.error(
        'Error al asignar la orden:',
        error.response?.data || error.message
      )
      Alert.alert('Error', 'Hubo un problema al asignar la orden.')
    }
  }

  const handleReject = async (solicitudId) => {
    try {
      const solicitudRef = doc(db, 'Solicitudes', solicitudId)

      await updateDoc(solicitudRef, {
        Estado: 'Rechazado',
      })

      Alert.alert('Rechazar', 'La solicitud ha sido rechazada correctamente.')
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error.message)
      Alert.alert('Error', 'Hubo un problema al rechazar la solicitud.')
    }
  }

  const renderSolicitud = ({ item }) => (
    <View style={[styles.card]}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.IdOrden}</Text>
      </View>
      <Text style={styles.details}>
        Incidente: {item.ubicacionIncidente || 'Cargando...'}
      </Text>
      <Text style={styles.details}>
        Destino: {item.ubicacionDestino || 'Cargando...'}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => handleAccept(getConductorId(), item.IdOrden, item.id)}
          style={[styles.button, styles.acceptButton]}
          labelStyle={styles.buttonText}
        >
          Aceptar
        </Button>
        <Button
          mode="contained"
          onPress={() => handleReject(item.id)}
          style={[styles.button, styles.rejectButton]}
          labelStyle={styles.buttonText}
        >
          Rechazar
        </Button>
      </View>
    </View>
  )

  return (
    <Background>
      <Header>Solicitudes</Header>
      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id}
        renderItem={renderSolicitud}
        contentContainerStyle={styles.list}
      />
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        labelStyle={styles.backButtonText}
      >
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  details: {
    fontSize: 16,
    color: '#34495e',
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
    alignItems: 'center',
  },
  button: {
    flex: 0.45,
    marginHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: '50%',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
})

export { OrderComplete }
