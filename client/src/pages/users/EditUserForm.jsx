import { useState, useEffect } from "react"
import { useUpdateUserMutation, useDeleteUserMutation } from "../../redux/users/usersApiSlice"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"
import { ROLES } from "../../config/roles"

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditUserForm = ({user}) => {

    // Llamamos a updateUser
    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateUserMutation()

    // Y a delete user
    const [deleteUser, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteUserMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [roles, setRoles] = useState(user.roles)
    const [active, setActive] = useState(user.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onRolesChanged = e => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        setRoles(values) // seteamos el rol para que sea utilizado
    }

    const onActiveChanged = () => setActive(prev => !prev)
    // Es para ver si esta activo o falso, es un false o true

    const onSaveUserClicked = async (e) => {
        if (password) {
            await updateUser({ id: user.id, username, password, roles, active })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    // Esperamos a deleteUser, y le pasamos la id del usuario para borrarlo
    const onDeleteUserClicked = async () => {
        await deleteUser({ id: user.id })
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option>
        )
    })

    let canSave
    // verificamos si tenemos una contraseña y si podemos guardar, usaremos esa contraseña valida
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        // Si no se tiene la contraseña, estariamos validando eso
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    
    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
    const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''
    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''
    // Acá nos basamos en el error de actualizacion y en el error de borrar


  return (
    <>
        <p className={errClass}>{errContent}</p>

        <form className="form" onSubmit={e => e.preventDefault()}>
            <div className="form__title-row">
                <h2>Edit User</h2>
            <div className="form__action-buttons">
                <button
                    className="icon-button"
                    title="Save"
                    onClick={onSaveUserClicked}
                    disabled={!canSave}
                >
                <FontAwesomeIcon icon={faSave} />
                </button>
                <button
                    className="icon-button"
                    title="Delete"
                    onClick={onDeleteUserClicked}
                >
                <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </div>
        </div>
        <label className="form__label" htmlFor="username">
            Username: <span className="nowrap">[3-20 letters]</span></label>
        <input
            className={`form__input ${validUserClass}`}
            id="username"
            name="username"
            type="text"
            autoComplete="off"
            value={username}
            onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
            Password: <span className="nowrap">[empty = no change]</span> <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
        <input
            className={`form__input ${validPwdClass}`}
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChanged}
        />

        <label className="form__label form__checkbox-container" htmlFor="user-active">
            ACTIVE:
        <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
        />
        </label>

        <label className="form__label" htmlFor="roles">
            ASSIGNED ROLES:</label>
        <select
            id="roles"
            name="roles"
            className={`form__select ${validRolesClass}`}
            multiple={true}
            size="3"
            value={roles}
            onChange={onRolesChanged}
        >
            {options}
        </select>

        </form>
    </>
  )
}

export default EditUserForm