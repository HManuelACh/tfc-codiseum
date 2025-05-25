import React, { useRef, useEffect, useState } from 'react'
import './Header.scss'
import SettingsWindow from './SettingsWindow';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import AuthService from '../api/AuthService';

function Header({ animateHeader, dynamicButtonScene }) {
  const { theme, themeColors, updateTheme } = useTheme();
  const headerRef = useRef(null);
  const [settingsWindow, setSettingsWindow] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (animateHeader) {
      dissapearAnimation();
    }
  }, [animateHeader]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const isLoggedIn = await AuthService.isLogged();
        setIsLoggedIn(isLoggedIn);
        
        if (isLoggedIn) {
          const isAdminUser = await AuthService.isAdmin();
          setAdmin(isAdminUser);
        } else {
          setAdmin(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
        setAdmin(false);
      }
    };
    checkAuthStatus();
  }, []);

  const dissapearAnimation = () => {
    headerRef.current.classList.add("dissapear");
  };

  const goToAdminPanel = () => {
    navigate('/admin');
  }

  const goToDynamic = () => {
    window.location.href = `/${dynamicButtonScene}`;
  };

  const toggleSettings = () => {
    setSettingsWindow(!settingsWindow);
  };

  return (
    <>
      <header
        ref={headerRef}
        style={{
          backgroundColor: themeColors[1],
          borderBottom: `7px solid ${themeColors[0]}`,
          transition: 'background-color 1s, border-bottom 1s'
        }}
      >
        <div className='content'>
          <div
            onClick={goToDynamic}
            className={`button scale more ${dynamicButtonScene === 'play' ? 'play' : 'default'}`}
          ></div>

          <div className='utils-container'>

            {admin && (
              <div
                onClick={goToAdminPanel}
                className="button scale admin"
              ></div>
            )}

             {isLoggedIn && (
               <div
                 onClick={toggleSettings}
                 className="button scale settings"
               ></div>
             )}

          </div>
        </div>
      </header>

      {settingsWindow && (
        <SettingsWindow toggleSettings={toggleSettings} updateTheme={updateTheme} />
      )}
    </>
  );
}

export default Header