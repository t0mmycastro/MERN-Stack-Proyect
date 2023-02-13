import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3500', // la url base es esta
    credentials: 'include', // de esta manera enviaremos siempre nuestra cookie
    prepareHeaders: (headers, { getState }) => {
        // primer parametros es el headers y desestructuramos el getState, esto nos permite tener el estado global de la aplicacion
        const token = getState().auth.token
        // aca estamos llamando al getState y mirando el estado de autenticacion, y luego obtenemos la token actual

        if (token) {
            headers.set("authorization", `Bearer ${token}`)
            // si hay token damos un un header de autoriozacion
        }
        return headers // esto se aplicará para cada solicitud q hagamos
    }
})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})

// Acá controlaremos las llamadas a la API, no usaremos ni axios ni fetch