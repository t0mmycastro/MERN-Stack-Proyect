import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import { useLocation, useNavigate } from 'react-router-dom'

const DashFooter = () => {

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const onGoHomeClicked = () => {
        if (!pathname !== '/dash') {
            navigate('/dash')
            
        }
    }

  return (
    <footer className="dash-footer">
        <p>Usuario: </p>
        <p>Estado:</p>
        <button onClick={onGoHomeClicked} className='dash-footer__button icon-button' ><FontAwesomeIcon icon={faHouse} /></button>
    </footer>
  )
}

export default DashFooter