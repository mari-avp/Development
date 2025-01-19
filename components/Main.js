// @ts-check
import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthContext } from '../context/AuthContext'
import { HomeScreen } from '../screens/HomeScreen'
import { SignInScreen } from '../screens/SignInScreen'
import { Dashboard } from '../screens/Dashboard'
import { OrderComplete } from '../screens/OrderComplete'
import { OrderProcess } from '../screens/OrderProcess'
import { OrderRejected } from '../screens/OrderRejected'
import { Perfil } from '../screens/Perfil'
import { Notification } from '../screens/Notification'
import { ServiceOrder } from '../screens/ServiceOrder'
import { AddCost } from '../screens/AddCost'
import { ErrorPage } from '../screens/ErrorPage' // Importa la página de error
import { Location } from '../screens/Location' // Importa la página de error

const NativeStack = createNativeStackNavigator()

const Main = () => {
  const { hasRole, state } = useContext(AuthContext)

  return (
    <NavigationContainer>
      <NativeStack.Navigator>
        {state.isSignedIn ? (
          <>
            <NativeStack.Screen name="Home" component={HomeScreen} />
            {hasRole('Conductor') ? (
              <>
                <NativeStack.Screen name="Dashboard" component={Dashboard} />
                <NativeStack.Screen
                  name="OrderComplete"
                  component={OrderComplete}
                />
                <NativeStack.Screen
                  name="OrderProcess"
                  component={OrderProcess}
                />
                <NativeStack.Screen
                  name="OrderRejected"
                  component={OrderRejected}
                />
                <NativeStack.Screen name="Perfil" component={Perfil} />
                <NativeStack.Screen
                  name="Notification"
                  component={Notification}
                />
                <NativeStack.Screen
                  name="ServiceOrder"
                  component={ServiceOrder}
                />
                <NativeStack.Screen name="AddCost" component={AddCost} />
                <NativeStack.Screen name="Location" component={Location} />
                <NativeStack.Screen name="ErrorPage " component={ErrorPage} />
              </>
            ) : (
              // Si el rol no coincide, redirige a la página de error
              <NativeStack.Screen name="ErrorPage " component={ErrorPage} />
            )}
          </>
        ) : (
          <NativeStack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ animationTypeForReplace: 'pop' }}
          />
        )}
      </NativeStack.Navigator>
    </NavigationContainer>
  )
}

export { Main }
