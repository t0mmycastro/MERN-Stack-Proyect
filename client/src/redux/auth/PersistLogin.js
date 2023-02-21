// este componente nos ayudará a seguir conectados aunque refresquemos la pagina

import { Outlet, Link } from "react-router-dom" // saliad de react router dom
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice" // importamos el hook de refresh que creamos en el segmento de auth api
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux' // estamos usando el useSelector
import { selectCurrentToken } from "./authSlice" // que seleccione el token actual

const PersistLogin = () => {

    // solo estamos agregando la variable persist de usePersist
    const [persist] = usePersist()
    // estamos seleccionado el token actual con el useSelector y el selectCurrentToken
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    // estamos creando una variable exitosa junto a su funcion, que se setea en false
    const [trueSuccess, setTrueSuccess] = useState(false)

    // traemos nuestra funcion de refresh junto a otros estados
    const [refresh, {
        isUninitialized, // no esta inicializado
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()


    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    //const response = 
                    await refresh()
                    //const { accessToken } = response.data
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])


    let content
    if (!persist) { // persist: no
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { //persist: yes, token: no
        console.log('loading')
        content = <p>Loading...</p>
    } else if (isError) { //persist: yes, token: no
        console.log('error')
        content = (
            <p className='errmsg'>
                {error.data?.message}
                <Link to="/login">Please login again</Link>.
            </p>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { //persist: yes, token: yes
        console.log('token and uninit')
        console.log(isUninitialized)
        content = <Outlet />
    }

    return content
}
export default PersistLogin


