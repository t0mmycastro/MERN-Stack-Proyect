import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectUserById } from '../../redux/users/usersApiSlice' // Seleccionar el usuario por ID

import React from 'react'

const User = ({ userId }) => {

    // Vamos a seleccionar el estado, en este caso usaremos el de seleccionar usuario por su Id y traeremos el parametro userId
    // y ya tendremos nuestro usuario
    const user = useSelector(state => selectUserById(state, userId))

    const navigate = useNavigate()
    
    // Si el usuario existe, entonces..
    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        // estamos ordenando mejor los roles
        const userRolesString = user.roles.toString().replaceAll(',', ', ')

        const cellStatus = user.active ? '' : 'table_cell--inactive'

        // y retornamos lo siguiente si el usuario es válido
        return (
            <tr className="table__row user">
                <td className={`table__cell ${cellStatus}`}>{user.username}</td>
                <td className={`table__cell ${cellStatus}`}>{userRolesString}</td>
                <td className={`table__cell ${cellStatus}`}>
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )
    } else return null
}

export default User