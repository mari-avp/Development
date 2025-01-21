// @ts-check
import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useReducer,
} from 'react'
import {
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session'
// eslint-disable-next-line no-unused-vars
import typedefs from './../typedefs'

/**
 * @type {typedefs.AuthState}
 */
const initialState = {
  isSignedIn: false,
  accessToken: null,
  idToken: null,
  userInfo: null,
  conductorId: null, // Campo para almacenar el conductorId
}

const AuthContext = createContext({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
  getUserId: () => null,
  getConductorId: () => null, // Nueva función para obtener el conductorId
  isLoadingConductorId: true, // Estado para indicar si el conductorId está cargando
  /**
   * @param {String} role
   * @returns Boolean
   */
  hasRole: (role) => false,
})

const AuthProvider = ({ children }) => {
  const discovery = {
    authorizationEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/auth`,
    tokenEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
    userInfoEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
  }

  const redirectUri = makeRedirectUri()
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
      redirectUri: redirectUri,
      scopes: ['openid', 'profile'],
    },
    discovery
  )

  const [authState, dispatch] = useReducer((previousState, action) => {
    switch (action.type) {
      case 'SIGN_IN':
        return {
          ...previousState,
          isSignedIn: true,
          accessToken: action.payload.access_token,
          idToken: action.payload.id_token,
        }
      case 'USER_INFO':
        return {
          ...previousState,
          userInfo: {
            username: action.payload.preferred_username,
            givenName: action.payload.given_name,
            familyName: action.payload.family_name,
            email: action.payload.email,
            roles: action.payload.roles || [], // Default to an empty array
          },
        }
      case 'SET_CONDUCTOR_ID':
        return {
          ...previousState,
          conductorId: action.payload, // Guardar conductorId
        }
      case 'SIGN_OUT':
        return initialState
      default:
        return previousState
    }
  }, initialState)

  const [userId, setUserId] = useState(null) // Estado para el userId (sub)
  const [isLoadingConductorId, setIsLoadingConductorId] = useState(true) // Estado de carga para conductorId

  const authContext = useMemo(
    () => ({
      state: authState,
      signIn: () => {
        promptAsync()
      },
      signOut: async () => {
        try {
          const idToken = authState.idToken
          await fetch(
            `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/logout?id_token_hint=${idToken}`
          )
          dispatch({ type: 'SIGN_OUT' })
          setUserId(null) // Limpia el ID del usuario al cerrar sesión
        } catch (e) {
          console.warn(e)
        }
      },
      getUserId: () => userId, // Proporciona el userId
      getConductorId: () => authState.conductorId, // Proporciona el conductorId
      isLoadingConductorId, // Proporciona el estado de carga de conductorId
      /**
       * @param {String} role
       * @returns Boolean
       */
      hasRole: (role) => {
        console.log('User roles:', authState.userInfo?.roles)
        return (
          Array.isArray(authState.userInfo?.roles) &&
          authState.userInfo.roles.indexOf(role) !== -1
        )
      },
    }),
    [authState, promptAsync, userId, isLoadingConductorId]
  )

  /**
   * Get access-token when authorization-code is available
   */
  useEffect(() => {
    const getToken = async ({ code, codeVerifier, redirectUri }) => {
      try {
        const formData = {
          grant_type: 'authorization_code',
          client_id: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
          code: code,
          code_verifier: codeVerifier,
          redirect_uri: redirectUri,
        }
        const formBody = Object.keys(formData)
          .map(
            (key) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`
          )
          .join('&')

        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formBody,
          }
        )
        if (response.ok) {
          const payload = await response.json()
          dispatch({ type: 'SIGN_IN', payload })
        }
      } catch (e) {
        console.warn(e)
      }
    }

    if (response?.type === 'success') {
      const { code } = response.params
      getToken({
        code,
        codeVerifier: request?.codeVerifier,
        redirectUri,
      })
    } else if (response?.type === 'error') {
      console.warn('Authentication error: ', response.error)
    }
  }, [dispatch, redirectUri, request?.codeVerifier, response])

  /**
   * Get user-info and conductorId when signing in completed
   */
  useEffect(() => {
    const getUserInfoAndConductorId = async () => {
      try {
        setIsLoadingConductorId(true) // Inicia la carga del conductorId
        const accessToken = authState.accessToken
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        )

        if (response.ok) {
          const payload = await response.json()
          console.log('User Info Payload:', payload)
          setUserId(payload.sub) // Almacena el userId (sub)
          dispatch({ type: 'USER_INFO', payload })

          // Fetch conductorId usando el userId (sub)
          console.log('Fetching conductorId using userId:', payload.sub)
          const conductorResponse = await fetch(
            `https://f8b4-2a0d-5600-4f-7000-29f2-3ec5-bdd0-7fe0.ngrok-free.app/api/Conductor/conductor/id-by-sub/${payload.sub}`
          )

          if (conductorResponse.ok) {
            const conductorData = await conductorResponse.json()
            console.log('ConductorId obtenido:', conductorData.conductorId)
            dispatch({
              type: 'SET_CONDUCTOR_ID',
              payload: conductorData.conductorId,
            })
          } else {
            console.warn(
              'Error al obtener conductorId:',
              conductorResponse.status
            )
          }
        } else {
          console.warn('Failed to fetch user info:', response.status)
        }
      } catch (e) {
        console.warn('Error fetching user info or conductorId:', e)
      } finally {
        setIsLoadingConductorId(false) // Finaliza la carga del conductorId
      }
    }

    if (authState.isSignedIn) {
      getUserInfoAndConductorId()
    }
  }, [authState.isSignedIn, authState.accessToken, dispatch])

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
