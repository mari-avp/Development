import React, { useEffect, useState, useContext } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext' // Contexto para obtener el idConductor

const GOOGLE_MAPS_API_KEY = 'AIzaSyC5WcTJIPfA-cdgqtnY5cnCD-KqxIVASAM' // Reemplaza con tu clave válida

export default function ServiceOrder({ route }) {
  const { getConductorId } = useContext(AuthContext) // Obtener el idConductor del contexto
  const [incidentCoords, setIncidentCoords] = useState(null)
  const [destinationCoords, setDestinationCoords] = useState(null)
  const [conductorCoords, setConductorCoords] = useState(null)
  const [routeToDestination, setRouteToDestination] = useState([])
  const [routeToIncident, setRouteToIncident] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const idConductor = getConductorId() // Obtener idConductor desde el contexto

    if (!idConductor) {
      Alert.alert('Error', 'No se encontró un idConductor.')
      return
    }

    const fetchOrderDetails = async () => {
      try {
        console.log('Obteniendo órdenes para idConductor:', idConductor)

        // Obtener el idOrden desde el endpoint del conductor
        const orderResponse = await axios.get(
          `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/${idConductor}/ordenes`
        )

        if (orderResponse.status === 200 && orderResponse.data.length > 0) {
          // Filtrar por estado = 1
          const activeOrder = orderResponse.data.find(
            (order) => order.estado === 1
          )

          if (!activeOrder) {
            console.error('No se encontró ninguna orden con estado=1.')
            Alert.alert('Error', 'No se encontró ninguna orden activa.')
            return
          }

          const { id } = activeOrder
          console.log('idOrden obtenido con estado=1:', id)

          // Obtener los detalles de la orden, incluyendo las coordenadas
          const detailsResponse = await axios.get(
            `https://gruasgateway-41350bb76e1e.herokuapp.com/ordenes/api/OrdenDeServicio/${id}`
          )

          if (detailsResponse.status === 200) {
            console.log('Detalles de la orden obtenidos:', detailsResponse.data)

            const {
              latitudIncidente,
              longitudIncidente,
              latitudDestino,
              longitudDestino,
              latitudConductor,
              longitudConductor,
            } = detailsResponse.data

            setIncidentCoords({
              latitude: parseFloat(latitudIncidente),
              longitude: parseFloat(longitudIncidente),
            })

            setDestinationCoords({
              latitude: parseFloat(latitudDestino),
              longitude: parseFloat(longitudDestino),
            })

            setConductorCoords({
              latitude: parseFloat(latitudConductor),
              longitude: parseFloat(longitudConductor),
            })

            // Obtener la ruta desde el conductor al incidente
            await fetchRoute(
              `${latitudConductor},${longitudConductor}`,
              `${latitudIncidente},${longitudIncidente}`,
              setRouteToIncident
            )

            // Obtener la ruta desde el incidente al destino
            await fetchRoute(
              `${latitudIncidente},${longitudIncidente}`,
              `${latitudDestino},${longitudDestino}`,
              setRouteToDestination
            )
          } else {
            console.error(
              'Error al obtener detalles de la orden:',
              detailsResponse.status
            )
            Alert.alert(
              'Error',
              'No se pudieron obtener los detalles de la orden.'
            )
          }
        } else {
          console.error(
            'Error al obtener órdenes del conductor:',
            orderResponse.status
          )
          Alert.alert('Error', 'No se encontraron órdenes para este conductor.')
        }
      } catch (error) {
        console.error('Error al obtener órdenes o detalles:', error.message)
        Alert.alert('Error', 'No se pudo conectar con el servidor.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [getConductorId])

  const fetchRoute = async (origin, destination, setRoute) => {
    try {
      console.log('Obteniendo ruta entre:', origin, 'y', destination)

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`
      )

      if (response.data.status === 'OK') {
        const points = decodePolyline(
          response.data.routes[0].overview_polyline.points
        )
        setRoute(points)
        console.log('Ruta obtenida con éxito:', points)
      } else {
        console.error(
          'Error al obtener la ruta:',
          response.data.status,
          response.data.error_message
        )
        Alert.alert(
          'Error',
          `No se pudo obtener la ruta: ${response.data.error_message || response.data.status}`
        )
      }
    } catch (error) {
      console.error('Error al obtener la ruta:', error.message)
      Alert.alert('Error', 'No se pudo conectar con la API de Google Maps.')
    }
  }

  const decodePolyline = (t) => {
    let points = []
    let index = 0,
      len = t.length
    let lat = 0,
      lng = 0

    while (index < len) {
      let b,
        shift = 0,
        result = 0
      do {
        b = t.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      let dlat = result & 1 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = result = 0
      do {
        b = t.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      let dlng = result & 1 ? ~(result >> 1) : result >> 1
      lng += dlng

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 })
    }

    return points
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando mapa...</Text>
      </View>
    )
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: incidentCoords?.latitude || 0,
        longitude: incidentCoords?.longitude || 0,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}
    >
      {incidentCoords && (
        <Marker
          coordinate={incidentCoords}
          title="Ubicación de Recogida"
          description="Incidente"
        />
      )}
      {destinationCoords && (
        <Marker
          coordinate={destinationCoords}
          title="Destino"
          description="Destino del servicio"
          pinColor="blue"
        />
      )}
      {conductorCoords && (
        <Marker
          coordinate={conductorCoords}
          title="Ubicación del Conductor"
          pinColor="green"
        />
      )}
      {routeToIncident.length > 0 && (
        <Polyline
          coordinates={routeToIncident}
          strokeColor="red"
          strokeWidth={3}
        />
      )}
      {routeToDestination.length > 0 && (
        <Polyline
          coordinates={routeToDestination}
          strokeColor="blue"
          strokeWidth={3}
        />
      )}
    </MapView>
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

export { ServiceOrder }
