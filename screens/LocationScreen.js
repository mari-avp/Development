import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import * as Location from 'expo-location'
import MapView, { Marker } from 'react-native-maps'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext' // Asegúrate de importar el contexto

export default function LocationScreen() {
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const { getConductorId } = useContext(AuthContext) // Obtiene la función para el conductorId
  const idConductor = getConductorId() // Obtén el idConductor desde el contexto

  useEffect(() => {
    if (!idConductor) {
      console.warn('No se encontró un idConductor.')
      return
    }

    const fetchLocation = async () => {
      try {
        // Solicitar permisos de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(
            'Error',
            'Se requiere permiso para acceder a la ubicación.'
          )
          setLoading(false)
          return
        }

        // Obtener la ubicación actual
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        })

        const newLocation = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }

        setLocation(newLocation)

        // Enviar la ubicación al endpoint
        await updateConductorLocation(
          loc.coords.latitude.toString(),
          loc.coords.longitude.toString(),
          idConductor
        )

        Alert.alert(
          'Ubicación Guardada',
          'La ubicación se ha guardado correctamente.'
        )
      } catch (error) {
        console.error(error)
        Alert.alert('Error', 'No se pudo obtener la ubicación.')
      } finally {
        setLoading(false)
      }
    }

    fetchLocation()
  }, [idConductor]) // El efecto depende de idConductor

  const updateConductorLocation = async (latitude, longitude, id) => {
    try {
      console.log(`Guardando latitud: ${latitude}, longitud: ${longitude}`)
      const response = await axios.put(
        `https://gruasgateway-41350bb76e1e.herokuapp.com/proveedores/api/Conductor/UpdateUbicacion/${id}`,
        {
          latitud: latitude,
          longitud: longitude,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200) {
        console.log('Ubicación actualizada correctamente en el servidor.')
      } else {
        console.error('Error al actualizar ubicación:', response.status)
      }
    } catch (error) {
      console.error('Error al llamar al endpoint:', error.message)
      Alert.alert('Error', 'No se pudo enviar la ubicación al servidor.')
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando ubicación...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {location ? (
        <MapView style={styles.map} region={location}>
          <Marker coordinate={location} title="Mi Ubicación Actual" />
        </MapView>
      ) : (
        <Text>No se pudo obtener la ubicación.</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
})

export { LocationScreen }
