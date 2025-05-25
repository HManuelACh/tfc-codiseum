import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../../../../../../context/ThemeProvider';
import UserService from '../../../../../../api/UserService';
import './ClassificationPanel.scss';

function ClassificationPanel({ inQueue, setAnimateHeader, userData }) {

  const { themeColors } = useTheme();
  const classificationPanelRef = useRef(null);
  const leagues = ["BRONCE", "PLATA", "ORO", "DIAMANTE"];
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    UserService.getTopUsers().then((players) => {
      setTopPlayers(players);
    });
  }, []);

  useEffect(() => {
    if (inQueue) {
      enterBattle();
    }
  }, [inQueue]);

  const enterBattle = () => {
    classificationPanelRef.current.classList.add("battle-mode");
  }

  const handleAnimationHeader = () => {
    setAnimateHeader(true);
  }

  return (
    <div
      className='classification-panel'
      style={{
        borderRight: `7px solid ${themeColors[0]}`,
        transition: 'border-right 1s'
      }}
      ref={classificationPanelRef}
      onAnimationEnd={handleAnimationHeader}
    >
      <div
        className='title-container'
        style={{
          backgroundColor: themeColors[2],
          borderBottom: `7px solid ${themeColors[0]}`,
          transition: 'background-color 1s, border-bottom 1s'
        }}
      >
        <div
          className="league-title"
          style={{
            width: '217px',
            height: '63px',
            imageRendering: 'pixelated',
            backgroundImage: "url('./icons/titles_spritesheet.png')",
            backgroundSize: '476px 63px',
            backgroundPosition: `-0px 0px`,
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
      </div>

      <div className='league-content'>

        <div className='current-league'>
          <div
            style={{
              width: '91px',
              height: '98px',
              imageRendering: 'pixelated',
              backgroundImage: "url('./icons/leagues_spritesheet.png')",
              backgroundSize: '364px 98px',
              backgroundPosition: `-${(userData) ? (91 * leagues.indexOf(userData.league)) : '0'}px 0px`,
              backgroundRepeat: 'no-repeat'
            }}
          ></div>

          <span className='league-name'>{(userData) ? userData.league : "..."}</span>
          <span className='league-points'>Puntos: {(userData) ? userData.points : "..."}</span>
        </div>

        <div className='top-players'>
          <p className='title'>Top</p>
          <div className="top-player-list">
            {[0, 1, 2].map((index) => (
              <div className="top-player-entry" key={index}>
                {topPlayers[index] ? (
                  <>
                    <div className="scroll-container" title={topPlayers[index].username}>
                      <div className="scroll-text">
                        {topPlayers[index].username}: {topPlayers[index].points} puntos
                      </div>
                    </div>
                  </>
                ) : (
                  <span className="player-name">...</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

export default ClassificationPanel;