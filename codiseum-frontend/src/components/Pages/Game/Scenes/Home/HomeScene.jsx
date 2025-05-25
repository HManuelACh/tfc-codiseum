import React, {useState} from 'react'
import './HomeScene.scss'
import Header from '../../../../Header';
import BattleRequestsPanel from './Panels/BattleRequestsPanel';
import ClassificationPanel from './Panels/ClassificationPanel';
import BattlePanel from './Panels/BattlePanel';

function HomeScene({ themeColors, updateTheme, inQueue, enterQueue, username, setUsername, socketRef, handleUserData, setScene, battleRequests, setBattleRequests, usernameElementRef, userData }) {

    const [animateHeader, setAnimateHeader] = useState(false);

    return (
        <div className='home-scene'>
            <Header themeColors={themeColors} updateTheme={updateTheme} animateHeader={animateHeader} dynamicButtonScene={"info"} ></Header>

            <div className={`main-content  ${inQueue ? '' : ''}`}>
                <ClassificationPanel
                    themeColors={themeColors} 
                    inQueue={inQueue} 
                    setAnimateHeader={setAnimateHeader}
                    userData={userData}
                ></ClassificationPanel>

                <BattlePanel
                    themeColors={themeColors}
                    inQueue={inQueue}
                    enterQueue={enterQueue}
                    username={username}
                    setUsername={setUsername}
                    socketRef={socketRef}
                    onUserData={handleUserData}
                    setScene={setScene}
                    usernameElementRef={usernameElementRef}
                ></BattlePanel>

                <BattleRequestsPanel 
                    themeColors={themeColors}
                    inQueue={inQueue} 
                    socketRef={socketRef} 
                    battleRequests={battleRequests} 
                    setBattleRequests={setBattleRequests}
                ></BattleRequestsPanel>
            </div>
        </div>
    )
}

export default HomeScene