import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { selectNoteById } from '../../redux/notesApiSlice/notesApiSlice' // Seleccionar el nota por ID

import React from 'react'

const Note = ({noteId}) => {
    // Hacemos la variable nota, que tendrá el stado y el noteid
    const note = useSelector(state => selectNoteById(state, noteId))

    const navigate = useNavigate()

    if (note) {
        // Si nota existe...

        // Estamos creando una nueva date y poniendole en idioma en US, y también estamos proporcionado el valor del dia
        // como numero y el mes como long para ambos
        const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/notes/${noteId}`)
        
        return (
            <tr className="table__row">
                <td className="table__cell note__status">
                    {note.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="note__status--open">Open</span>
                    }
                </td>
                <td className="table__cell note__created">{created}</td>
                <td className="table__cell note__updated">{updated}</td>
                <td className="table__cell note__title">{note.title}</td>
                <td className="table__cell note__username">{note.username}</td>

                <td className="table__cell">
                    <button
                        className="icon-button table__button"
                        onClick={handleEdit}
                    >
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        )


    } else return null
  /* return (
    <div>Note</div>
  ) */
}

export default Note