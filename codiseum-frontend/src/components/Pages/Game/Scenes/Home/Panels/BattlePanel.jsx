import React, { useRef, useEffect, useState } from 'react';
import UsernameElement from '../../../../../UsernameElement';
import Player from '../../../../../Player/Player';
import './BattlePanel.scss'
import SelectionAnimation from '../../../../../Animated/SelectionAnimation';
import { useTheme } from '../../../../../../context/ThemeProvider';

function BattlePanel({ enterQueue, username, setUsername, socketRef, inQueue, setScene, usernameElementRef }) {
  const gameModes = ['./html_logo_scaled.png', './css_logo_scaled.png', './js_logo_scaled.png'];
  const [currentGameMode, setCurrentGameMode] = useState(0);

  const [isAnimationEnded, setIsAnimationEnded] = useState(false);
  const playerRef = useRef(null);

  // Obtén el tema desde el contexto
  const { themeColors } = useTheme();

  useEffect(() => {
    if (isAnimationEnded) {
      setScene("queue");
    }
  }, [isAnimationEnded]);

  const handleNextGameMode = () => {
    if (currentGameMode >= (gameModes.length - 1)) {
      setCurrentGameMode(0);
    } else {
      setCurrentGameMode(currentGameMode + 1);
    }
  }

  const handlePreviousGameMode = () => {
    if (currentGameMode <= 0) {
      setCurrentGameMode(gameModes.length - 1);
    } else {
      setCurrentGameMode(currentGameMode - 1);
    }
  }

  return (
    <div className='battle-panel'>

      <img
        className={`mode-logo ${currentGameMode !== 0 ? 'grayscale' : ''}`}
        src={gameModes[currentGameMode]}
      />

      <UsernameElement themeColors={themeColors} ref={usernameElementRef} setUsername={setUsername} username={username} socketRef={socketRef}></UsernameElement>
      <div className='player-wrapper'>
        <Player ref={playerRef}></Player>
      </div>

      {!isAnimationEnded && (
        <div className='battle-button-container'>

          <div
            onClick={handlePreviousGameMode}
            className={`button scale previous`}
          />

          <div
            onClick={enterQueue}
            className={`button scale battle ${currentGameMode !== 0 ? 'grayscale' : ''}`}
          />

          <div
            onClick={handleNextGameMode}
            className={`button scale next`}
          />

        </div>
      )}

      {inQueue &&
        <SelectionAnimation
          initialTop={75}
          initialLeft={500}
          setIsAnimationEnded={setIsAnimationEnded}
          isAnimationEnded={isAnimationEnded}
        >
        </SelectionAnimation>}

    </div>
  );
}

export default BattlePanel;