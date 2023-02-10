import React from 'react'
import { useSelector } from 'react-redux'
// La nota necesita algunos datos existentes, por lo que vamos a usar el useSelector
// para seleccionar todos los usuarios
import { selectAllUsers } from '../../redux/users/usersApiSlice'
//seleccionamos todos los usuarios
import NewNoteForm from '../notes/NewNoteForm'

const NewNote = () => {

    const users = useSelector(selectAllUsers)

    const content = users ? <NewNoteForm users={users} /> : <p>Loading...</p>

    return content
    
}

export default NewNote