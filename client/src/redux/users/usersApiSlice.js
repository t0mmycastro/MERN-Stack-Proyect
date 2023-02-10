
/* Esta manera de llamar una API, es como manejar un estado sumando las llamadas
a los endpoints, es como una mezcla que es bastante efectiva */

import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const usersAdapter = createEntityAdapter({})
// Creamos un adaptador de usuario específico para nuestro segmento de usuario

const initialState = usersAdapter.getInitialState()

// Exportamos nuestra componente usersApiSlice y a la vez llamamos a apiSlices
// InjectEndpoints para ejecutar las llamadas
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Acá traeremos los usuarios con esta query, es un GET
        getUsers: builder.query({
            // Solo pondremos el endpoint, ya que la direccion la definimos en
            // apiSlice
            query: () => '/users',
            // Validamos el error
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                // Obtenemos la respuesta de la consulta
                const loadedUsers = responseData.map(user => {
                    // Mapeamos los datos de los usuarios
                    user.id = user._id
                    // acá estamos buscando la id del usuario, la matriz
                    return user
                });
                return usersAdapter.setAll(initialState, loadedUsers)
                // proporcionamos al estado, los usuarios cargados, asi quedan guardados
            },
            providesTags: (result, error, arg) => {
                // Comprobando si existe una propiedad ids, si no la hay, devolvemos el usuario y la lista de ID junto a los resultado de id map
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            // Esto es una mutación
            // Le pasaremos datos iniciales de los usuarios
            query: initialUserData => ({
                // endpoint, en este caso /users
                url: '/users',
                // metodo que usaremos post
                method: 'POST',
                // en el body le pasaremos los datos iniciales con ...initialUserData
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
                // Esto invalidará la lista de usuarios, por lo cual tendrá que actualizarse siempre el cache cuando haya cambios
            ]
        }),
        updateUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'PATCH',
                body: {
                    ...initialUserData,
                }
            }),
            // Ahora no es la lista, ahora podemos especificar el ID del usuario que estamos pasando
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
        deleteUser: builder.mutation({
            query: ({ id }) => ({
                url: `/users`,
                method: 'DELETE',
                body: { id }
            }),
            // Lo unico que cambia acá, es que como dato inicial solo pasamos la ID
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
})

export const { useGetUsersQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation } = usersApiSlice
// Con estos hooks podremos utilizar la data en las vistas de los componentes

// Acá estamos seleccionado el resultado del endpoint, estamos seleccioando
// todos los usuarios que trajimos con
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// Creamos un selector donde guardaremos selectUsersResult
const selectUsersData = createSelector(
    selectUsersResult,
    // También tenemos una función que tiene el resultado del usuario y entra y toma
    // los datos ids y las entidades
    usersResult => usersResult.data // normalized state object with ids & entities
)

//getSelectors lo desestructuramos en selectAll, que selecciona todos los usuarios
// SelectById, seleccionado el usuario por su id
// selectIds, seleccionar usuarios id
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState) // Tdoo esto pasa al estado inicial.