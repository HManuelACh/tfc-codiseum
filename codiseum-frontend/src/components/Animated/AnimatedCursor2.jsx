import React, { useEffect, useState, useRef } from 'react';

function AnimatedCursor2({ initialTop, initialLeft, targetTop, targetLeft, onAnimationEnd, setIsSelecting }) {
  const [position, setPosition] = useState({ top: 0, left: 0 });  // Comienza en (0, 0)
  const [step, setStep] = useState(0);  // Control de los pasos
  const animatedCursorRef = useRef(null);  // Referencia del cursor

  useEffect(() => {
    if (step === 0) {
      // En el paso 0, mueve el cursor desde (0, 0) a la posición inicial
      setPosition({ top: initialTop, left: initialLeft });
    } else if (step === 1) {
      // En el paso 1, mueve el cursor hacia la posición final (targetTop, targetLeft)
      setTimeout(() => {
        setPosition({ top: targetTop, left: targetLeft });
      }, 50);
    }
  }, [initialTop, initialLeft, targetTop, targetLeft, step]);

  const style = {
    position: 'fixed',
    top: `${position.top}px`,
    left: `${position.left}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    transition: 'top 1s ease-out, left 1s ease-out',  // Misma animación para el cursor
  };

  const handleTransitionEnd = () => {
    if (step === 0) {
      // Si hemos llegado al paso 0, cambiamos al paso 1 para mover el cursor al objetivo
      setIsSelecting(true);
      setStep(1);
    } else if (step === 1) {
      // Una vez que llegamos a la posición final, llamamos al método de finalización
      setTimeout(onAnimationEnd, 150);
    }
  };

  return (
    <img
      onTransitionEnd={handleTransitionEnd}  // Al finalizar la transición, actualizamos el paso
      ref={animatedCursorRef}
      src='./cursor_scaled.png'
      className='animated-cursor'
      style={style}
    />
  );
}

export default AnimatedCursor2;