import { useAddNewNoteMutation } from '../../redux/notesApiSlice/notesApiSlice'
import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave } from "@fortawesome/free-solid-svg-icons"
import {useNavigate} from 'react-router-dom'


const NewNoteForm = ({users}) => {

  const [addNewNote, {
    isLoading,
    isSuccess,
    isError,
    error
  }] = useAddNewNoteMutation ()

  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [userId, setUserId] = useState(users[0].id)
  // Acá estamos asignandole como inicialstate, el usuario 0.id, o sea que sera el primer usuario

  useEffect(() => {
    // Si da success, pasa esto..
    if (isSuccess) {
        setTitle('')
        setText('')
        setUserId('')
        navigate('/dash/notes')
    }
  }, [isSuccess, navigate])

  const onTitleChanged = e => setTitle(e.target.value)
  const onTextChanged = e => setText(e.target.value)
  const onUserIdChanged = e => setUserId(e.target.value)

  const canSave = [title, text, userId].every(Boolean) && !isLoading
  // Verificamos que title text y userid sean verdaderos y que isloading sea false

  const onSaveNoteClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
        await addNewNote({ user: userId, title, text })
        // si es verdadero, añadimos la nueva nota
    }
  }

  const options = users.map(user => {
    return (
        <option
          key={user.id}
          value={user.id}

        >{user.username}</option>
    )
  })

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !title ? "form__input--incomplete" : ''
  const validTextClass = !text ? "form__input--incomplete" : ''


  return (
    <>
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveNoteClicked}>
                <div className="form__title-row">
                    <h2>Nueva nota</h2>
                    <div className="form__action-buttons">
                        <button
                            className="icon-button"
                            title="Save"
                            disabled={!canSave}
                        >
                            <FontAwesomeIcon icon={faSave} />
                        </button>
                    </div>
                </div>
                <label className="form__label" htmlFor="title">
                    Titulo:</label>
                <input
                    className={`form__input ${validTitleClass}`}
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    value={title}
                    onChange={onTitleChanged}
                />

                <label className="form__label" htmlFor="text">
                    Texto:</label>
                <textarea
                    className={`form__input form__input--text ${validTextClass}`}
                    id="text"
                    name="text"
                    value={text}
                    onChange={onTextChanged}
                />

                <label className="form__label form__checkbox-container" htmlFor="username">
                    ASIGNADO A:</label>
                <select
                    id="username"
                    name="username"
                    className="form__select"
                    value={userId}
                    onChange={onUserIdChanged}
                >
                    {options}
                </select>

            </form>
        </>
  )
}

export default NewNoteForm