import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.scss';
import GamePage from './components/Pages/Game/GamePage';
import ResourcesPage from './components/Pages/Resources/ResourcesPage';
import { ThemeProvider } from './context/ThemeProvider';
import AdminPage from './components/Pages/Admin/AdminPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <div className='app-container'>
        <Router>
          <Routes>
            <Route
              path='/play'
              element={
                <ProtectedRoute allowedRoles={['ROLE_USER']}>
                  <GamePage />
                </ProtectedRoute>
              }
            />
            <Route path='/info' element={<ResourcesPage />} />
            <Route
              path='/admin'
              element={
                <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route path='/' element={<Navigate to='/info' replace />} />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;