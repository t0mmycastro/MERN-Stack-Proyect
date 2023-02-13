import React from 'react'
import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { useNavigate, Link, useLocation } from 'react-router-dom'

import {useSendLogoutMutation} from '../../redux/auth/authApiSlice'

// vamos a utilizar estas expresiones regulares para compararlos con la ubicacion de la url para verifcicar en que ubicacion estamos o no y para usarlo para decidir si queremos mostrar algo como un boton en nuestro header o no
const DASH_REGEX = /^\/dash(\/)?$/
const NOTES_REGEX = /^\/dash\/notes(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/

const DashHeader = () => {

  const navigate = useNavigate()
  const { pathname } = useLocation()
  // desusctructarcion de uselocation

  // obtenemos la funcion de cierre de sesion
  const [sendLogout, {
    // varias cosas sobre el estado cuando llamamos a la funcion
      isLoading,
      isSuccess,
      isError,
      error
  }] = useSendLogoutMutation()

useEffect(() => {
  // el useffect verificara el estado exitoso y por supuesto ponemos la funcion de navegar solo para apeciguar, por las dudas
    if (isSuccess) navigate('/')
}, [isSuccess, navigate])

if (isLoading) return <p>Cerrando sesión...</p>

if (isError) return <p>Error: {error.data?.message}</p>

let dashClass = null
// esto nos asegura que no estamos en ninguna pagina que no sea el dash
if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
    dashClass = "dash-header__container--small"
}

const logoutButton = (
    <button
        className="icon-button"
        title="Logout"
        onClick={sendLogout}
    >
        <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
)

  return (
  <header className="dash-header">
    <div className={`dash-header__container ${dashClass}`}>
        <Link to="/dash">
            <h1 className="dash-header__title">Taller TNeuquen</h1>
        </Link>
        <nav className="dash-header__nav">
            {/* add more buttons later */}
            {logoutButton}
        </nav>
    </div>
  </header>
  )
}

export default DashHeader