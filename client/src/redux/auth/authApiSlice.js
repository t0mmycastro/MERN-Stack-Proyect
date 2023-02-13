import { apiSlice } from "../api/apiSlice";
import { logOut } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    // definimos los endpoints
    endpoints: builder => ({
        login: builder.mutation({
            // credenciales, esto seria el nombre de usuario y contraseña que enviamos con la consulta
            query: credentials => ({
                // esto lo enviaremos a la ruta auth
                url: '/auth',
                method: 'POST',
                // recibiremos todos los datos que hay en credentials
                body: { ...credentials }
            })
        }),
        sendLogout: builder.mutation({
            query: () => ({
                // esto va a nuestra ruta de cierre de sesion
                url: '/auth/logout',
                method: 'POST',
            }),
            // rtk query nos proporciona una funcion que se llama onQueryStarted,
            // que podemos llamar dentro de nuestro endpoint
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                // definimos un arg que nosotros no lo estamos definiendo pero que se necesita realmente, luego tambien necesitamos el dispatch, que sería el envío y la consulta cumplida para que podamos verificar que nuestra consulta se haya cumplido
                try {
                    //const { data } = 
                    // estamos esperando la consulta cumplida
                    await queryFulfilled
                    //console.log(data)
                    // enviaremos el cierre de sesion al estado
                    dispatch(logOut())
                    // reseteará el estado el de abajo y el cache
                    dispatch(apiSlice.util.resetApiState())
                } catch (err) {
                    console.log(err)
                }
            }
        }),
        refresh: builder.mutation({
            query: () => ({
                // solicitud para traer una nueva token actualizada y cookie
                url: '/auth/refresh',
                method: 'GET',
            })
        })
    })
})

export const { // exportamos los hooks
    useLoginMutation,
    useSendLogoutMutation,
    useRefreshMutation,
} = authApiSlice 