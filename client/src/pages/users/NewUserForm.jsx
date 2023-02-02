import React from 'react'
import { useState, useEffect } from "react" // Lo usamos para los forms
import { useAddNewUserMutation } from "../../redux/users/usersApiSlice" // Para crear nuevo usuario
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

// Expresiones regulares para usuario y contraseña, para que sea mas fiable y para validacion
const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const NewUserForm = () => {

  // Esto nos brinda la funcion addNewUser para creación de usuarios,
  // Luego tenemos los estados y el error
  const [addNewUser, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewUserMutation()

  const navigate = useNavigate() // pa navegar

    // estado del username
    const [username, setUsername] = useState('')
    // Esta solo será true cuando cumpla con las expresiones regulares
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    // Pasa lo mismo con la contraseña que con el username, la validación va con las expresiones regulares
    const [validPassword, setValidPassword] = useState(false)
    // Estado de los roles, por defecto el estado traerá a Empleado en roles, por default
    const [roles, setRoles] = useState(["Employee"])

    // con esto validaremos el usuario cada vez que este sea cambiado(modificado), esto suicede porque se le especifica username en el parametor de abajo
    useEffect(() => {
      setValidUsername(USER_REGEX.test(username))
    }, [username])

    // lo mismo para la contraseña
    useEffect(() => {
      setValidPassword(PWD_REGEX.test(password))
    }, [password])


    useEffect(() => {
      // Controlamos el estado de éxito una vez llamada a nuestra función de crear usuario
      if (isSuccess) {
        // Si es exitosa, vaciaremos todos los estados por algo vacío y navegaremos
        // a nuestra lista de usuarios nuevamente
          setUsername('')
          setPassword('')
          setRoles([])
          navigate('/dash/users')
      }
    }, [isSuccess, navigate]) // el navigate lo ponemos ahi para que no hayan errores, en los params

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)
    // estas funciones de arriba sacan el evento onChange y además agarran el valor que se escriba en los formualrios

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
            // a values le vamos a establecer lo que eliga el usuario, la opcion
        )
        setRoles(values) // establecemos el rol en el estado que eliga el usuario
    }

    // Acá para guardar tenemos un array, ponemos roles.length,nombre de usuario
    // valido y contraseña valida, llamamos al metodo every con un boolean dentro
    // para ver que todo sea True asi lo guardamos. luego verifamos el estado de carga
    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
          // Si canSave es exitoso, entonces llamamos a la funcion de crear Usuario
          // le pasamos username, password y roles
            await addNewUser({ username, password, roles })
        }
    }


  return (
    <div>NewUserForm</div>
  )
}

export default NewUserForm