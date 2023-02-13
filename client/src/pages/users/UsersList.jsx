import React from 'react'
import { useGetUsersQuery } from '../../redux/users/usersApiSlice'
import User from './User'

const UsersList = () => {

  // Traeremos users, y varios tipos de estados como isLoading y manejaremos el rror
  const { data: users, isLoading, isSuccess, isError, error } = useGetUsersQuery(undefined, {
    pollingInterval: 60000, // 60 segundos
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true // esto es para que los datos siempre se esten refrescando, se hace con el Listener
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>
  }

  if(isSuccess) {

    // Si es exitoso desustructaremos los ids de los usuarios
    const { ids } = users

    const tableContent = ids?.length // Con esto nos aseguramos que exsista la matriz ids
        ? ids.map(userId => <User key={userId} userId={userId} />) // Estariamos mapeando los usuarios por su userID
        : null

    return (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
              <th scope="col" className="table__th user__username">Usuario</th>
              <th scope="col" className="table__th user__roles">Roles</th>
              <th scope="col" className="table__th user__edit">Editar</th>
          </tr>
        </thead>
        <tbody>
          {tableContent}
        </tbody>
      </table>
      )
  }
}

export default UsersList