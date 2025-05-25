import React from 'react'
import './LoadingScreen.scss'

function LoadingScreen(props) {

    const {exitQueue} = props;

  return (
    <div className='loading-screen'>
        <div className='logo'>
            <p className='arrow'>&gt;&nbsp;</p>
            <p className='codiseum-text'> CODISEUM</p>
            <p className='cursor'>_</p>
        </div>

        <button onClick={exitQueue}>Salir de la cola</button>
    </div>
  )
}

export default LoadingScreen