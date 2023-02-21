import React from 'react'
import { Routes,Route } from 'react-router-dom'
import DashLayout from '../components/DashLayout/DashLayout'
import Home from '../pages/Home'
import Login from '../pages/auth/Login'
import RutaOutlet from '../pages/RutaOutlet'
import Welcome from '../pages/auth/Welcome'
import NotesList from '../pages/notes/NotesList'
import UsersList from '../pages/users/UsersList'
import EditUser from '../pages/users/EditUser'
import NewUserForm from '../pages/users/NewUserForm'
import EditNote from '../pages/notes/EditNote'
import NewNote from '../pages/notes/NewNote'
import Prefetch from '../pages/auth/Prefetch'
import PersistLogin from '../redux/auth/PersistLogin'


export const Routers = () => {
  return (
    <Routes>
        <Route path='/' element={<RutaOutlet />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />

          <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
          <Route path='dash' element={<DashLayout />}>
            <Route index element={<Welcome />} />

            <Route path='notes'>
              <Route index element={<NotesList />} />
                {/* Editar note */}
                <Route path=':id' element={<EditNote />} />
                {/* Añadir usuario */}
                <Route path='new' element={<NewNote />} />
            </Route>

            <Route path='users'>
              <Route index element={<UsersList />} />
               {/* Editar usuario */}
              <Route path=':id' element={<EditUser />} />
               {/* Añadir usuario */}
              <Route path='new' element={<NewUserForm />} />
            </Route>
          </Route> {/* termina el dash */}
          </Route>
          </Route>
        </Route>
    </Routes>
  )
}
