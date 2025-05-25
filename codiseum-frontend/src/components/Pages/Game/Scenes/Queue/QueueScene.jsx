import React, { useEffect } from 'react'
import './QueueScene.scss'
import PlayableCharacter from '../../../../Playable/Player/PlayableCharacter'
import { EnterQueueMessage, QuitQueueMessage } from '../../../../../model/Message';

function QueueScene({ socketRef, exitQueue, themeColors }) {

  useEffect(() => {

    const message = new EnterQueueMessage();
    socketRef.current.send(JSON.stringify(message.toJson()));

  }, []);

  const handleExitQueue = () => {

    const message = new QuitQueueMessage();
    socketRef.current.send(JSON.stringify(message.toJson()));
    exitQueue();
  }

  return (
    <div className='queue-scene'>
      <div className='information-container'>
        <h1 className='loading-text'>Buscando partida</h1>
        <div
          onClick={handleExitQueue}
          className="button hover scale"
          style={{
            width: '252px',
            height: '112px',
            imageRendering: 'pixelated',
            backgroundImage: "url('./icons/icons_spritesheet2.png')",
            backgroundSize: '980px 112px',
            backgroundPosition: '-728px 0px',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>
    </div>
  )
}

export default QueueScene