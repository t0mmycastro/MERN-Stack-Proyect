import React from 'react'
import { useGetNotesQuery } from "../../redux/notesApiSlice/notesApiSlice"
import Note from './Note'

const NotesList = () => {
  const {
    // En vez de users traemos las notes
      data: notes,
      isLoading,
      isSuccess,
      isError,
      error
  } = useGetNotesQuery(undefined, {
    pollingInterval: 15000, // mostraremos los datos mas recientes cada 15 segundos, pueden haber muchos usuarios haciendo notas
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })

  let content

  if (isLoading) content = <p>Loading...</p>

  if (isError) {
      content = <p className="errmsg">{error?.data?.message}</p>
  }

  if (isSuccess) {
      const { ids } = notes

      const tableContent = ids?.length
          ? ids.map(noteId => <Note key={noteId} noteId={noteId} />)
          : null

      return (
          <table className="table table--notes">
              <thead className="table__thead">
                  <tr>
                      <th scope="col" className="table__th note__status">Username</th>
                      <th scope="col" className="table__th note__created">Created</th>
                      <th scope="col" className="table__th note__updated">Updated</th>
                      <th scope="col" className="table__th note__title">Title</th>
                      <th scope="col" className="table__th note__username">Owner</th>
                      <th scope="col" className="table__th note__edit">Edit</th>
                  </tr>
              </thead>
              <tbody>
                  {tableContent}
              </tbody>
          </table>
      )
  }
}
export default NotesList