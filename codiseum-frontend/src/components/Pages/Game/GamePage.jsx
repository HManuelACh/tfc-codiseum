import React, { useState, useEffect, useRef, } from 'react'
import { connectWebSocket } from '../../../ws/socketClient';
import QueueScene from './Scenes/Queue/QueueScene';
import HomeScene from './Scenes/Home/HomeScene';
import GameScene from './Scenes/Game/GameScene';
import { useNavigate } from 'react-router-dom';
import './GamePage.scss'
import AuthService from '../../../api/AuthService';
import { GameData } from '../../../model/GameData';

function GamePage({ themeColors, updateTheme }) {
    const socketRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const [inQueue, setInQueue] = useState(false);

    const [battleRequests, setBattleRequests] = useState([]);
    const [username, setUsername] = useState("...");
    const [userData, setUserData] = useState(null);

    const [gameData, setGameData] = useState(null);
    const gameDataRef = useRef(null);

    const [scene, setScene] = useState("home");
    const sceneRef = useRef(scene);

    const usernameElementRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        sceneRef.current = scene;
    }, [scene]);

    useEffect(() => {
        gameDataRef.current = gameData;
    }, [gameData]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            const isLogged = await AuthService.isLogged();

            if (!isMounted) return;

            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }

            if (isLogged) {
                connectWebSocket(
                    socketRef,
                    () => setIsConnected(true),
                    () => setIsConnected(false),
                    async (data) => {
                        switch (data.type) {
                            case "userData":
                                handleUserData(data);
                                break;

                            case "battleRequest":
                                if (!battleRequests.includes(data.opponentUsername)) {
                                    setBattleRequests(prev => [...prev, data.opponentUsername]);
                                }
                                break;

                            case "startBattle":
                                if ((sceneRef.current === "home") || (sceneRef.current === "queue")) {
                                    setInQueue(false);
                                    setScene("game");
                                    const currentGameData = new GameData(data.challengeId, data.challengeName, data.opponentUsername, data.challengeDuration);
                                    setGameData(currentGameData);
                                }
                                break;

                            case "gameEnd":
                                if (sceneRef.current === "game") {

                                    if (gameDataRef.current) {
                                        
                                        const updatedGameData = {
                                            ...gameDataRef.current.toJson(),
                                            points: data.points,
                                            opponentPoints: data.opponentPoints,
                                            completed: true
                                        };

                                        setGameData(updatedGameData);

                                    }
                                }
                                break;

                            case "error":
                                if (data.reason === "invalidUser") {
                                    AuthService.logout();
                                    socketRef.current?.close();
                                    navigate('/');
                                }
                                break;

                            default:
                                break;
                        }
                    }
                );
            } else {
                navigate('/');
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
        };
    }, []);

    const enterQueue = () => {
        setInQueue(true);
    }

    const exitQueue = () => {
        setInQueue(false);
        setScene("home");
    }

    const handleUserData = (data) => {
        if (data.username == null) {
            usernameElementRef.current?.cancelUpdateName();
        } else {
            setUserData(data);
            setUsername(data.username);
            usernameElementRef.current?.saveUpdatedName();
        }
    };

    return (

        <div className='game-page'>

            {/* Escena: Menú */}
            {scene === 'home' && (
                <HomeScene

                    themeColors={themeColors}
                    updateTheme={updateTheme}
                    inQueue={inQueue}
                    enterQueue={enterQueue}
                    username={username}
                    setUsername={setUsername}
                    socketRef={socketRef}
                    handleUserData={handleUserData}
                    setScene={setScene}
                    battleRequests={battleRequests}
                    setBattleRequests={setBattleRequests}
                    usernameElementRef={usernameElementRef}
                    userData={userData}

                ></HomeScene>
            )}

            {/* Escena: Cola de espera */}
            {scene === 'queue' && (
                <QueueScene
                    socketRef={socketRef}
                    exitQueue={exitQueue}
                ></QueueScene>
            )}

            {/* Escena: Partida */}
            {scene === 'game' && (
                <GameScene
                    gameData={gameData}
                    username={username}
                    socketRef={socketRef}
                    scene={scene}
                    setScene={setScene}
                ></GameScene>
            )}

        </div>
    )
}

export default GamePage