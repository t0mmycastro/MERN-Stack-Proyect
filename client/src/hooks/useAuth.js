import { useSelector } from 'react-redux'
import { selectCurrentToken } from '../redux/auth/authSlice'
// con esto podremos decodificar el token de acceso que recibimos de la db
import jwtDecode from 'jwt-decode'

const useAuth = () => {

    // recibimos nuestro token usando el useSelector y el selectCurrentToken
    const token = useSelector(selectCurrentToken)
    let isManager = false // manager es falso
    let isAdmin = false // isAdmin es falso
    let status = "Empleado" // el status inicial es de Empleado

    if (token) { // si tenemos un token..
        const decoded = jwtDecode(token) // hacemos un decod del token
        // vamos a desestructurar de decoded username y roles, haremos decoded de UserInfo, que es donde nosotros colocamos los valores en nuestro backend
        const { username, roles } = decoded.UserInfo

        isManager = roles.includes('Manager') // aca estamos buscando un Manager
        isAdmin = roles.includes('Admin') // acá estamos buscando un administrador

        if (isManager) status = "Manager" // si es un manager, entonces el status cambia a Manager
        if (isAdmin) status = "Admin" // si es un admin, entonces el status cambia a Admin


        // devolvemos el username, el array con roles, el status, ismanger e isAdmin
        return { username, roles, status, isManager, isAdmin }
    }

    return { username: '', roles: [], status, isManager, isAdmin }
}

export default useAuth