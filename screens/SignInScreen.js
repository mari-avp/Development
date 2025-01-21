// @ts-check
import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { AuthContext } from '../context/AuthContext'
import Background from '../ui/Background'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import Header from '../ui/Header'

const SignInScreen = () => {
  const { signIn } = useContext(AuthContext)

  return (
    <Background>
      <Logo />
      <Header>¡Bienvenido!</Header>
      <View style={styles.buttonContainer}>
        <Button mode={'contained'} onPress={signIn}>
          Iniciar Sesión
        </Button>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 50, // Ajusta este valor para mover el botón más arriba
    alignItems: 'center', // Centra horizontalmente
  },
})

export { SignInScreen }
