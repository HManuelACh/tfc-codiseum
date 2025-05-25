import React, { useEffect, useRef, useState } from 'react';
import './PlayableCharacter.scss';
import Player from '../../Player/Player';

function PlayableCharacter({ initialTop = 0, initialLeft = 0 }) {
  const playableCharacterRef = useRef(null);

  const position = useRef({ x: initialLeft, y: initialTop });
  const [isFlipped, setIsFlipped] = useState(false);
  const force = useRef({ horizontal: 0, vertical: 0 });
  const maxSpeed = { horizontal: 7, vertical: 12 };
  const friction = 0.4;

  const keysPressed = useRef({});
  const animationFrame = useRef(null);

  const skinColor = "#FFFFFF";
  const skinShadowColor = "#b5a8a0";

  const [characterHeight, setCharacterHeight] = useState(0);
  const [groundLevel, setGroundLevel] = useState(window.outerHeight);

  const [isWalking, setIsWalking] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (playableCharacterRef.current) {
      const characterRect = playableCharacterRef.current.getBoundingClientRect();
    
      setCharacterHeight(characterRect.height);
      const calculatedGroundLevel = document.documentElement.clientHeight - characterRect.height;
      setGroundLevel(calculatedGroundLevel);
    
      position.current.x = (document.documentElement.clientWidth - characterRect.width) / 2;
      position.current.y = (document.documentElement.clientHeight - characterRect.height) / 2;
    
      playableCharacterRef.current.style.left = `${position.current.x}px`;
      playableCharacterRef.current.style.top = `${position.current.y}px`;
    }

    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    
      if (!keysPressed.current['ArrowLeft'] && !keysPressed.current['ArrowRight']) {
        setIsWalking(false);
      }
    };
    

    const updatePosition = () => {
      const isRunning = keysPressed.current['Shift'] || keysPressed.current['ShiftLeft'] || keysPressed.current['ShiftRight'];

      const baseAcceleration = 0.5;
      const runningAcceleration = 1;
      const acceleration = isRunning ? runningAcceleration : baseAcceleration;

      const baseMaxSpeed = 7;
      const runningMaxSpeed = 12;
      const currentMaxSpeed = isRunning ? runningMaxSpeed : baseMaxSpeed;

      if (keysPressed.current['ArrowLeft']) {
        force.current.horizontal -= acceleration;
        setIsFlipped(true);
        setIsWalking(true);
      }

      if (keysPressed.current['ArrowRight']) {
        force.current.horizontal += acceleration;
        setIsFlipped(false);
        setIsWalking(true);
      }

      if (keysPressed.current[' '] && position.current.y >= groundLevel) {
        force.current.vertical = -20;
      }

      const isInAir = position.current.y < groundLevel;
      const isInGround = position.current.y >= groundLevel;

      if (force.current.vertical < 0) {
        setIsJumping(true);
      }

      if (isInGround) {
        setIsJumping(false);
      }

      if (!keysPressed.current['ArrowLeft'] && !keysPressed.current['ArrowRight']) {
        if (force.current.horizontal > 0) {
          force.current.horizontal = Math.max(force.current.horizontal - friction, 0);
        } else if (force.current.horizontal < 0) {
          force.current.horizontal = Math.min(force.current.horizontal + friction, 0);
        }
        if (!isJumping) setIsWalking(false);
      }

      if (Math.abs(force.current.horizontal) > currentMaxSpeed) {
        force.current.horizontal = Math.sign(force.current.horizontal) * currentMaxSpeed;
      }

      if (force.current.vertical >= maxSpeed.vertical) {
        force.current.vertical = maxSpeed.vertical;
      } else {
        force.current.vertical += 1;
      }

      position.current.x += force.current.horizontal;
      position.current.y += force.current.vertical;

      if (position.current.y > groundLevel) {
        position.current.y = groundLevel;
        force.current.vertical = 0;
      
        if (isJumping) setIsJumping(false);
      }

      if (position.current.x < 0) {
        position.current.x = 0;
        force.current.horizontal = 0;
      } else if (position.current.x > document.documentElement.clientWidth - playableCharacterRef.current.offsetWidth) {
        position.current.x = document.documentElement.clientWidth - playableCharacterRef.current.offsetWidth;
        force.current.horizontal = 0;
      }

      if (playableCharacterRef.current) {
        playableCharacterRef.current.style.left = `${position.current.x}px`;
        playableCharacterRef.current.style.top = `${position.current.y}px`;
      }

      animationFrame.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrame.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [groundLevel, characterHeight]);

  return (
    <div
      className='playable-character'
      draggable={false}
      ref={playableCharacterRef}
      style={{
        position: 'absolute',
        left: `${position.current.x}px`,
        top: `${position.current.y}px`,
        transform: isFlipped ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <Player skinColor={skinColor} skinShadowColor={skinShadowColor} isWalking={isWalking} isJumping={isJumping} />
    </div>
  );
}

export default PlayableCharacter;