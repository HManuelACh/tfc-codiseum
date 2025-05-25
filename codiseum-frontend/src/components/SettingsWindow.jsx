import React, { useState } from 'react';
import './SettingsWindow.scss';
import AuthService from '../api/AuthService';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeProvider';
import UserService from '../api/UserService';

function SettingsWindow({ toggleSettings }) {
    const navigate = useNavigate();
    const { themeColors } = useTheme();

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleConfirmDeleteAccount = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteAccount = async () => {
        try {
            await UserService.deleteCurrentUser(); // Asegúrate de que este método exista
            await AuthService.logout();
            navigate('/info');
        } catch (error) {
            console.error('Error al borrar cuenta:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            navigate('/info');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className='settings-window' style={{ backgroundColor: themeColors[3] }}>
            <h1 className='title' style={{ color: themeColors[0] }}>Ajustes</h1>

            <div className='section'>
                <h2 className='title' style={{ color: themeColors[0] }}>Mi cuenta</h2>
                <div className="button-row">
                    <button className="button action-button" onClick={handleLogout}>Cerrar sesión</button>
                    <button className="button action-button delete" onClick={handleConfirmDeleteAccount}>Borrar cuenta</button>
                </div>

                {showDeleteConfirm && (
                    <div className="delete-confirmation">
                        <p className="delete-account-confirm">¿Seguro que quieres borrar tu cuenta?</p>
                        <button className="button action-button delete" onClick={handleDeleteAccount}>Sí, borrar mi cuenta</button>
                    </div>
                )}
            </div>

            <img
                onClick={toggleSettings}
                className='button scale cancel'
                src='./cancel_button_scaled.png'
                alt="Cerrar ajustes"
            />
        </div>
    );
}

export default SettingsWindow;