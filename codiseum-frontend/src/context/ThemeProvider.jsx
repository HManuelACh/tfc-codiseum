import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const ThemeContext = createContext();

// Proveedor del contexto
export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme !== null ? Number(savedTheme) : 0;
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Definir los colores y nombres de los temas
  const themeData = [
    {
      name: 'Por defecto',  // Nombre del tema claro
      colors: ['#4E1F00', '#74512D', '#FEBA17', '#F8F4E1']  // Colores del tema claro
    },
    {
      name: 'Oscuro',  // Nombre del tema oscuro
      colors: ['#030303', '#123458', '#D4C9BE', '#F1EFEC']  // Colores del tema oscuro
    }
  ];

  // Obtener los colores del tema seleccionado
  const themeColors = themeData[theme].colors;
  const themeName = themeData[theme].name; // Obtener el nombre del tema

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeColors, themeName, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useTheme = () => useContext(ThemeContext);