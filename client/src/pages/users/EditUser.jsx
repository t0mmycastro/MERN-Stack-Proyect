import React from 'react'
import {useParams} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from '../../redux/users/usersApiSlice'
import EditUserForm from './EditUserForm'

const EditUser = () => {

  const { id } = useParams()

  const user = useSelector(state => selectUserById(state, id))

  const content = user ? <EditUserForm user={user} /> : <p>Cargando...</p>

  return content
}

export default EditUser