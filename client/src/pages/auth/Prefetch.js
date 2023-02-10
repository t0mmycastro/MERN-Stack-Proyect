import { store } from '../../redux/store'
import { notesApiSlice } from '../../redux/notesApiSlice/notesApiSlice'
import { usersApiSlice } from '../../redux/users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
    useEffect(() => {
        console.log('subscribing')
        // Subscripcion manual
        // Llamamos a los apisSlices, luego a los endpoints y a su respectivo get y lo initiate
        const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
        const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

        return () => {
            console.log('unsubscribing')
            notes.unsubscribe()
            users.unsubscribe()
        }
    }, [])

    return <Outlet />
}

export default Prefetch