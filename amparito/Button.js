import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

export default function Button({ mode, style, ...props }) {
  return (
    <PaperButton
      style={[
        styles.button,
        mode === 'outlined' && {
          backgroundColor: theme.colors.surface, // Fondo transparente
          borderColor: theme.colors.primary, // Borde del color primario
        },
        mode === 'contained' && {
          backgroundColor: theme.colors.primary, // Fondo del color primario
        },
        style,
        { borderWidth: 1 }, // Borde visible para outline
      ]}
      labelStyle={[
        styles.text,
        mode === 'outlined' && { color: theme.colors.primary }, // Texto del color primario para outline
        mode === 'contained' && { color: 'white' }, // Texto blanco para contained
        { fontSize: 18 },
      ]}
      mode={mode}
      contentStyle={{ height: 50 }}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    flexWrap: 'wrap',
  },
  text: {
    fontWeight: 'bold',
  },
})
