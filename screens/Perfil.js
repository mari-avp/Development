import React from 'react'
import Background from '../amparito/Background'
import Header from '../amparito/Header'
import Button from '../amparito/Button'
import Logo from '../amparito/Logo'
import { Text, View, StyleSheet } from 'react-native'

export default function Perfil({ navigation }) {
  const grueroInfo = {
    nombre: 'Juan Pérez',
    teléfono: '+58 123 456 789',
    email: 'juanperez@example.com',
    licencia: 'ABC-12345',
  }

  return (
    <Background>
      <Logo />
      <Header>Perfil del Gruero</Header>

      <View style={styles.container}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.value}>{grueroInfo.nombre}</Text>

        <Text style={styles.label}>Teléfono:</Text>
        <Text style={styles.value}>{grueroInfo.teléfono}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{grueroInfo.email}</Text>

        <Text style={styles.label}>Licencia:</Text>
        <Text style={styles.value}>{grueroInfo.licencia}</Text>
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
