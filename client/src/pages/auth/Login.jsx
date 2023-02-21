import React from 'react'
import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
// usedispatch para el envio de las credenciales
import { useDispatch } from 'react-redux'

import { setCredentials } from '../../redux/auth/authSlice'
import { useLoginMutation } from '../../redux/auth/authApiSlice'
import usePersist from '../../hooks/usePersist'

const Login = () => {

  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, { isLoading }] = useLoginMutation()
  // incorporamos una funcion de login cuando la necesitamos y isLoading para el estado de carga

  useEffect(() => {
    userRef.current.focus()
    // esta referencia pone el foco en ese input digamos
  }, [])

  useEffect(() => {
    // aca pone el mensaje de error en vacio cuando el usuario o password se cambia
    setErrMsg('');
  }, [username, password])


  
  const handleSubmit = async (e) => {
    // lo hacemos una funcion asincronica para recibir algo
    e.preventDefault()
    try {
        // vamos a recuperar nuestra accessToken después de llamar a la funcion login y esperará ese resultado del username y password y desenvolvemos el resultado con unwrap
        const { accessToken } = await login({ username, password }).unwrap()
        // vamos a enviar las credenciales establecidas que estan anteriormente y recibimos un token de acceso de vuelta y esas serán nuestras credenciales
        dispatch(setCredentials({ accessToken }))
        setUsername('')
        setPassword('') // vaciamos username y password
        navigate('/dash') // nos llevará al dashboard
    } catch (err) {
      // si no tenemos un estado de error, diremos que no hubo respuesta del servidor
        if (!err.status) {
            setErrMsg('No Server Response');
        } else if (err.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.status === 401) {
            setErrMsg('Unauthorized');
        } else {
          // si no recibimos el error que sea
            setErrMsg(err.data?.message);
        }
        errRef.current.focus();
    }
  } 


  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)
  const handleToggle = () => setPersist(prev => !prev)
  //acá lo que haremos es usar setPersist y tomar el valor anterior y configurarlo en lo contrario porque solo será una casilla de verificacion

  const errClass = errMsg ? "errmsg" : "offscreen"

  // si se está cargando devolveremos un parrafo de cargando
  if (isLoading) return <p>cargando...</p>

  return (
    <section className="public">
            <header>
                <h1>Login de empleados</h1>
            </header>
            <main className="login">
                <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p> {/* Acá esta definido el error */}

                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="username">Usuario:</label>
                    <input
                        className="form__input"
                        type="text"
                        id="username"
                        ref={userRef}
                        value={username}
                        onChange={handleUserInput}
                        autoComplete="off"
                        required
                    />

                    <label htmlFor="password">Contraseña:</label>
                    <input
                        className="form__input"
                        type="password"
                        id="password"
                        onChange={handlePwdInput}
                        value={password}
                        required
                    />
                    <button className="form__submit-button">Iniciar sesion</button>

                    <label htmlFor='persist' className='form__persist'>
                      <input type="checkbox" className='form__checkbox' id='persist' onChange={handleToggle} checked={persist} />
                    </label>
                </form>
            </main>
            <footer>
                <Link to="/">Volver a la página principal</Link>
            </footer>
        </section>
  )
}

export default Login