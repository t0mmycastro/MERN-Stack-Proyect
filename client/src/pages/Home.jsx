import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
        <section className="public">
            <header>
                <h1>Bienvenido a <span className="nowrap">TNeuquen!</span></h1>
            </header>
            <main className="public__main">
                <p>Localizado en Argentina, Neuquén</p>
                <address className="public__addr">
                    T...<br />
                    5...<br />
                    Ciudad...<br />
                    <a href="tel:+15555555555">(555) 555-5555</a>
                </address>
                <br />
                <p>Dueño: Tomás Castro</p>
            </main>
            <footer>
                <Link to="/login">Login de empleados</Link>
            </footer>
        </section>
  )
}

export default Home