// @ts-check
import React, { createContext, useEffect, useMemo, useReducer } from 'react'
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
}

const AuthContext = createContext({
  state: initialState,
  signIn: () => {},
  signOut: () => {},
  /**
   * @param {String} role
   * @returns Boolean
   */
  // eslint-disable-next-line no-unused-vars
  hasRole: (role) => false,
})

const AuthProvider = ({ children }) => {
  const discovery = {
    authorizationEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/auth`,
    tokenEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/token`,
    userInfoEndpoint: `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
  }

  // @ts-ignore
  const redirectUri = makeRedirectUri()
  const [request, response, promptAsync] = useAuthRequest(
    {
      // @ts-ignore
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
      case 'SIGN_OUT':
        return initialState
      default:
        return previousState
    }
  }, initialState)

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
        } catch (e) {
          console.warn(e)
        }
      },
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
    [authState, promptAsync]
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
   * Get user-info when signing in completed
   */
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const accessToken = authState.accessToken;
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: 'application/json',
            },
          }
        );
        if (response.ok) {
          const payload = await response.json();
          console.log('User Info Payload:', payload); // <-- Registra toda la respuesta
          dispatch({ type: 'USER_INFO', payload });
        } else {
          console.warn('Failed to fetch user info:', response.status);
        }
      } catch (e) {
        console.warn('Error fetching user info:', e);
      }
    };
    
    if (authState.isSignedIn) {
      getUserInfo()
    }
  }, [authState.accessToken, authState.isSignedIn, dispatch])

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
