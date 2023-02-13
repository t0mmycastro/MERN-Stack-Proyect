import React from 'react'
import { useSelector } from 'react-redux'
// La nota necesita algunos datos existentes, por lo que vamos a usar el useSelector
// para seleccionar todos los usuarios
import { selectAllUsers } from '../../redux/users/usersApiSlice'
//seleccionamos todos los usuarios
import NewNoteForm from '../notes/NewNoteForm'

const NewNote = () => {

    const users = useSelector(selectAllUsers)

    // necesitamos saber que usuarios existen para apoder asignar una nueva nota al usuario
    if (!users?.length) return <p>Actualmente no se encuentra disponible esta página</p>

    const content = <NewNoteForm users={users} /> 

    return content
    
}

export default NewNote