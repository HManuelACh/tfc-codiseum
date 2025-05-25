import React, { useEffect, useState } from 'react';
import AnimatedCursor2 from './AnimatedCursor2';
import PlayableCharacter from '../Playable/Player/PlayableCharacter';

function SelectionAnimation({ initialTop, initialLeft, setIsAnimationEnded, isAnimationEnded }) {
  const [style, setStyle] = useState({});
  const [targetTop, setTargetTop] = useState(0);
  const [targetLeft, setTargetLeft] = useState(0);

  const [isSelecting, setIsSelecting] = useState(false);

  const handleAnimationEnd = () => {
    setIsSelecting(false);
    setIsAnimationEnded(true);
  };

  useEffect(() => {
    if (isAnimationEnded) {
      const newTargetLeft = window.innerWidth + 100;
      setTargetLeft(newTargetLeft);
      setTargetTop(targetTop);
    }
  }, [isAnimationEnded, targetTop]);

  useEffect(() => {
    const newTargetTop = window.innerHeight - initialTop;
    const newTargetLeft = window.innerWidth - initialLeft;

    // Guardamos coordenadas objetivo
    setTargetTop(newTargetTop);
    setTargetLeft(newTargetLeft);
  }, [initialTop, initialLeft]);

  // Esta parte se activa cuando isSelecting cambia a true
  useEffect(() => {
    if (isSelecting) {
      // Estilo inicial colapsado
      setStyle({
        top: `${initialTop}px`,
        left: `${initialLeft}px`,
        width: '0px',
        height: '0px',
        position: 'absolute',
        border: '2px solid rgba(0, 123, 255, 0.8)',
        backgroundColor: 'rgba(0, 97, 242, 0.3)',
        pointerEvents: 'none',
        zIndex: 9998,
        transition: 'width 1s ease-out, height 1s ease-out',
      });

      // Estilo expandido aplicado tras pequeño delay para permitir transición
      setTimeout(() => {
        const width = targetLeft - initialLeft;
        const height = targetTop - initialTop;

        setStyle(prev => ({
          ...prev,
          width: `${Math.abs(width)}px`,
          height: `${Math.abs(height)}px`,
        }));
      }, 50); // pequeño delay para dar tiempo al navegador a aplicar el estado inicial
    }
  }, [isSelecting, initialTop, initialLeft, targetTop, targetLeft]);

  return (
    <div className="selection-animation">
      <AnimatedCursor2 
        initialTop={initialTop} 
        initialLeft={initialLeft} 
        targetTop={targetTop} 
        targetLeft={targetLeft} 
        onAnimationEnd={handleAnimationEnd}
        setIsSelecting={setIsSelecting}
      />
      {!isAnimationEnded && isSelecting && <div className="selection" style={style}></div>}

    </div>
  );
}

export default SelectionAnimation;