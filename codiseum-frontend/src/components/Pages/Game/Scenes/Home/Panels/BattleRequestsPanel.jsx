import React, { useRef, useState, useEffect } from 'react'
import './BattleRequestsPanel.scss'
import { BattleRequestMessage } from '../../../../../../model/Message';
import { useTheme } from '../../../../../../context/ThemeProvider';

function BattleRequestsPanel({ socketRef, battleRequests, setBattleRequests, inQueue }) {

    const opponentSearchRef = useRef(null);
    const battleRequestsPanelRef = useRef(null);

    // Obtén el tema desde el contexto
    const { themeColors } = useTheme();

    const acceptBattleRequest = (opponentUsername) => {
        const acceptedRequest = new BattleRequestMessage(opponentUsername, true);

        socketRef.current.send(JSON.stringify(acceptedRequest.toJson()));
        setBattleRequests(prevRequests =>
            prevRequests.filter(inv => inv !== opponentUsername)
        );
    };

    const rejectBattleRequest = (opponentUsername) => {
        const rejectedRequest = new BattleRequestMessage(opponentUsername, false);

        socketRef.current.send(JSON.stringify(rejectedRequest.toJson()));
        setBattleRequests(prevRequests =>
            prevRequests.filter(prevRequestUsername => prevRequestUsername !== opponentUsername)
        );
    };

    const sendBattleRequest = (event) => {
        const opponentUsername = opponentSearchRef.current.value;
        const newBattleRequest = new BattleRequestMessage(opponentUsername);

        const alreadySent = battleRequests.includes(opponentUsername);

        if (alreadySent) {
            alert("Ya has retado a ese jugador");
            return;
        }

        socketRef.current.send(JSON.stringify(newBattleRequest.toJson()));
    }

    useEffect(() => {
        if (inQueue) {
            enterBattle();
        } else {
        }
    }, [inQueue])

    const enterBattle = () => {
        battleRequestsPanelRef.current.classList.add("battle-mode");
    }

    return (
        <div
            className='battle-requests-panel'
            ref={battleRequestsPanelRef}
            style={{
                borderLeft: `7px solid ${themeColors[0]}`,
                transition: 'border-left 1s'
            }}
        >
            <div
                className='requests-title-container'
                style={{
                    backgroundColor: themeColors[2],
                    borderBottom: `7px solid ${themeColors[0]}`,
                    transition: 'background-color 1s, border-bottom 1s'
                }}
            >
                <div
            className="requests-title"
            style={{
              width: '259px',
              height: '63px',
              imageRendering: 'pixelated',
              backgroundImage: "url('./icons/titles_spritesheet.png')",
              backgroundSize: '476px 63px',
              backgroundPosition: '-217px 0px',
              backgroundRepeat: 'no-repeat'
            }}
          ></div>
            </div>

            <div className='list'>

                <div
                    className='search-container'
                    style={{
                        borderBottom: `7px solid ${themeColors[0]}`,
                        transition: 'border-bottom 1s'
                    }}
                >
                    <input type='search' ref={opponentSearchRef} placeholder='Buscar oponente'></input>

                    <div
                        onClick={sendBattleRequest}
                        className="button scale send"
                    ></div>

                </div>

                {battleRequests.map((battleRequest, index) => (
                    <div className='battle-request' key={index}>
                        <span className='sender'>{battleRequest}</span>
                        <div className='button-container'>
                            <div
                                onClick={() => acceptBattleRequest(battleRequest)}
                                className="button scale accept"
                            ></div>

                            <div
                                onClick={() => rejectBattleRequest(battleRequest)}
                                className="button scale reject"
                            ></div>

                        </div>
                    </div>
                ))}

            </div>

        </div>
    )
}

export default BattleRequestsPanel