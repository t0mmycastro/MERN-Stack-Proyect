import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    // el estado inicial tendrá un objeto que tiene propiedad de token y 
    // se establecerá en nulo porque esperaremos recibir el token de vuelta de nuestra API
    initialState: { token: null },
    reducers: {
        // los reducers son objetos e ingresaremos los dos reductores que estamos creando
        setCredentials: (state, action) => {
            const { accessToken } = action.payload
            // cambiamos el estado de null a accessToken, porque la estariamos recibiendo
            state.token = accessToken
        },
        logOut: (state, action) => {
            // establecemos la token en null porque es logout
            state.token = null
        }
    }
})

// exportaremos el setCredentials y el logOut que son los creadores de la accion
export const { setCredentials, logOut } = authSlice.actions

// esto lo exportamos para agregarlo a store
export default authSlice.reducer

// estamos exportando el selector con el estado, state.auth.token, auth
//viene porque le asignamos ese nombre arriba
export const selectCurrentToken = (state) => state.auth.token