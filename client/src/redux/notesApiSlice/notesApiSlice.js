
/* Esta manera de llamar una API, es como manejar un estado sumando las llamadas
a los endpoints, es como una mezcla que es bastante efectiva */

import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

const notesAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})
// Creamos un adaptador de usuario específico para nuestro segmento de usuario

const initialState = notesAdapter.getInitialState()

// Exportamos nuestra componente notesApiSlice y a la vez llamamos a apiSlices
// InjectEndpoints para ejecutar las llamadas
export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        // Acá traeremos los usuarios con esta query
        getNotes: builder.query({
            // Solo pondremos el endpoint, ya que la direccion la definimos en
            // apiSlice
            query: () => '/notes',
            // Validamos el error
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                // Obtenemos la respuesta de la consulta
                const loadedNotes = responseData.map(note => {
                    // Mapeamos los datos de los usuarios
                    note.id = note._id
                    // acá estamos buscando la id del usuario, la matriz
                    return note
                });
                return notesAdapter.setAll(initialState, loadedNotes)
                // proporcionamos al estado, los usuarios cargados, asi quedan guardados
            },
            providesTags: (result, error, arg) => {
                // Comprobando si existe una propiedad ids, si no la hay, devolvemos el usuario y la lista de ID junto a los resultado de id map
                if (result?.ids) {
                    return [
                        { type: 'note', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'note', id }))
                    ]
                } else return [{ type: 'note', id: 'LIST' }]
            }
        }),
        addNewUser: builder.mutation({
            query: initialUserData => ({
                url: '/users',
                method: 'POST',
                body: {
                    ...initialUserData,
                }
            }),
            invalidatesTags: [
                { type: 'User', id: "LIST" }
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
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id }
            ]
        }),
    }),
})

export const { useGetNotesQuery, useAddNewUserMutation, useUpdateUserMutation, useDeleteUserMutation } = notesApiSlice

// Acá estamos seleccionado el resultado del endoint, estamos seleccioando
// todos los usuarios que trajimos con
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// Creamos un selector donde guardaremos selectnotesResult
const selectNotesData = createSelector(
    selectNotesResult,
    // También tenemos una función que tiene el resultado del usuario y entra y toma
    // los datos ids y las entidades
    notesResult => notesResult.data // normalized state object with ids & entities
)

//getSelectors lo desestructuramos en selectAll, que selecciona todos los usuarios
// SelectById, seleccionado el usuario por su id
// selectIds, seleccionar usuarios id
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
    // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState) // Tdoo esto pasa al estado inicial.