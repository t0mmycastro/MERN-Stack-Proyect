import { Link } from 'react-router-dom'

const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    return (
        <section className="welcome">

            <p>{today}</p>

            <h1>Bienvenido!</h1>

            <p><Link to="/dash/notes">Ver las notas</Link></p>

            <p><Link to="/dash/notes/new">Añadir nuevas notas</Link></p>

            <p><Link to="/dash/users">Ver usuarios y configuracion</Link></p>

            <p><Link to="/dash/users/new">Añadir nuevo usuario</Link></p>

        </section>
    )

}
export default Welcome