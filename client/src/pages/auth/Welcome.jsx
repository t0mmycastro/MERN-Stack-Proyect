import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const { username, isManager, isAdmin } = useAuth()
    // extraemos username, ismanager e isadmin

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    return (
        <section className="welcome">

            <p>{today}</p>

            <h1>Bienvenido {username}!</h1>

            <p><Link to="/dash/notes">Ver las notas</Link></p>

            <p><Link to="/dash/notes/new">Añadir nuevas notas</Link></p>

            {/* Si tenemos un manager o un administrador, si algunos de estos es true, se mostrará el ver usuarios y configuracion */}
            {(isManager || isAdmin) && <p><Link to="/dash/users">Ver usuarios y configuracion</Link></p>}

            {(isManager || isAdmin) &&<p><Link to="/dash/users/new">Añadir nuevo usuario</Link></p>}

        </section>
    )

}
export default Welcome