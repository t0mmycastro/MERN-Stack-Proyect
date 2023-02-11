import React from 'react'
import { useParams } from 'react-router-dom' // Lo necesitamos para recoger la id que asignamos en la ruta
import { useSelector } from 'react-redux' 
import { selectNoteById } from '../../redux/notesApiSlice/notesApiSlice' // Traeremos las notas segun su id
import { selectAllUsers } from '../../redux/users/usersApiSlice' // Traeremos todos los usuarios
import EditNoteForm from './EditNoteForm'

const EditNote = () => {
  const { id } = useParams()

  // Estamos trayendo la nota, la nota especifica que tiene una identificacion cada una
  const note = useSelector(state => selectNoteById(state, id))
  // Tambien con un selector estamos obteniendo todos los usuarios que necesitamos de nuevo
  const users = useSelector(selectAllUsers)

  // Acá se verificará que tengamos los datos de la nota y los datos del usuario y si lo hace generaremos el formulario de la nota
  const content = note && users ? <EditNoteForm note={note} users={users} /> : <p>Cargando...</p>

  return content
}

export default EditNote