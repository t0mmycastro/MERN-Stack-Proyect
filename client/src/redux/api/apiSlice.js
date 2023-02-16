import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../auth/authSlice'

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

// consulta base con reautenticacion 
// aceptará argumentos que estamos pasando esencialmente a nuestra consulta basada en busqueda, tiene su propia API, no confundamos con el objeto api del que hablamos con los headers y hay un objeto de opciones adicionales 
const baseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    // definimos nuestro resultado con let, para esperar a la consulta baseQuery que definimos anteriormente y pasamos nuestros args, la api y las cosas adicionales
    let result = await baseQuery(args, api, extraOptions)

    // si obtenemos un estado de error 403, estoy registrando el envio de token de actualizacion
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        // obtendremos un resultado de actualización, nuestros arg acá son la ruta para ir a la actualizacio de autenticacion y luego le estamos pasando api y extraOptions
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        // aca estamos esperando el resultado del refresh junto a su data
        if (refreshResult?.data) {

            // store the new token y estamos enviando credenciales ya establecidas mas la token que recibimos
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // intentamos hacer la consulta original, estamos usando la consulta baseQuery nuevamente pero estamos pasando los argumentos una vez mas, los args son lo que definimos la primera vez
            result = await baseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. "
            }
            return refreshResult
        }
    }

    // devolvemos el resultado
    return result
}

export const apiSlice = createApi({
    baseQuery:  baseQueryWithReauth,
    tagTypes: ['Note', 'User'],
    endpoints: builder => ({})
})

// Acá controlaremos las llamadas a la API, no usaremos ni axios ni fetch