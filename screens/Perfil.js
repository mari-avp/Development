import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Background from '../ui/Background'
import Logo from '../ui/Logo'
import Header from '../ui/Header'
import Button from '../ui/Button'

const Perfil = ({ navigation }) => {
  // Recibe `navigation` como prop
  const { getConductorId, isLoadingConductorId } = useContext(AuthContext)
  const [clientData, setClientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        if (isLoadingConductorId) {
          console.log('Esperando a que el conductorId esté disponible...')
          return
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
          'Enviando solicitud al endpoint /Conductor/{id} con conductorId:',
          conductorId
        )

        const clientResponse = await axios.get(
          `https://gruasgateway-41350bb76e1e.herokuapp.com/proveedores/api/Conductor/${conductorId}`
        )

        console.log('Datos del conductor obtenidos:', clientResponse.data)
        setClientData(clientResponse.data)
      } catch (err) {
        console.error('Error al obtener datos del conductor:', err.message)
        setError(err.message || 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchClientData()
  }, [getConductorId, isLoadingConductorId])

  if (loading || isLoadingConductorId) {
    return (
      <Background>
        <Text>Cargando información del Conductor...</Text>
      </Background>
    )
  }

  if (error) {
    return (
      <Background>
        <Text>Error: {error}</Text>
        <Button title="Volver" onPress={() => navigation.goBack()} />
      </Background>
    )
  }

  return (
    <Background>
      <Logo />
      <Header>Información del conductor</Header>
      <View style={styles.container}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{clientData?.nombre || 'N/A'}</Text>

        <Text style={styles.label}>Apellido:</Text>
        <Text style={styles.value}>{clientData?.apellido || 'N/A'}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{clientData?.telefono || 'N/A'}</Text>

        <Text style={styles.label}>Documento de Identidad:</Text>
        <Text style={styles.value}>
          {clientData?.documentoIdentidad || 'N/A'}
        </Text>

        <Text style={styles.label}>Licencia:</Text>
        <Text style={styles.value}>{clientData?.licencia || 'N/A'}</Text>

        <Text style={styles.label}>Proveedor ID:</Text>
        <Text style={styles.value}>{clientData?.proveedorId || 'N/A'}</Text>

        <Text style={styles.label}>Activo:</Text>
        <Text style={styles.value}>{clientData?.activo ? 'Sí' : 'No'}</Text>
      </View>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Volver
      </Button>
    </Background>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
})

export { Perfil }
