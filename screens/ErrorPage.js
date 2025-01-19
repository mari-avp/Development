import React from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'

const ErrorPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>Lo siento, no tiene acceso.</Text>
      <Button
        title="Ir al Inicio de Sesión"
        onPress={() => navigation.navigate('SigninScreen')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})

export { ErrorPage }
