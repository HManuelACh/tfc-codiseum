import React, { useState, useEffect, useRef } from 'react'
import './Player.scss'

function Player({ onClick, onCustomization, skinColor = "#FFFFFF", skinShadowColor = "#b5a8a0", isWalking = false, isJumping = false }) {
  const [walkingFrame, setWalkingFrame] = useState(0);
  const intervalRef = useRef(null);
  const frameWidth = 13;
  const frameHeight = 23;
  const totalFrames = 8;

  const [jumpingFrame, setJumpingFrame] = useState(0);
  const jumpIntervalRef = useRef(null);
  const jumpTotalFrames = 3;

  useEffect(() => {
    if (isJumping) {
      setJumpingFrame(0);
      let currentFrame = 0;
      clearInterval(jumpIntervalRef.current);
      jumpIntervalRef.current = setInterval(() => {
        currentFrame += 1;
        setJumpingFrame(currentFrame);
        if (currentFrame >= jumpTotalFrames - 1) {
          clearInterval(jumpIntervalRef.current);
        }
      }, 60);
    } else {
      // Cuando deja de saltar, reinicia frame
      setJumpingFrame(0);
      clearInterval(jumpIntervalRef.current);
    }

    return () => clearInterval(jumpIntervalRef.current);
  }, [isJumping]);

  useEffect(() => {
    if (isWalking) {
      intervalRef.current = setInterval(() => {
        setWalkingFrame(prevFrame => (prevFrame + 1) % totalFrames);
      }, 150);
      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
      setWalkingFrame(0);
    }
  }, [isWalking]);

  const walkingStyle = {
    width: `${frameWidth}px`,
    height: `${frameHeight}px`,
    backgroundImage: 'url(/player/walk/walk_spritesheet.png)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `-${walkingFrame * frameWidth}px 0`,
    imageRendering: 'pixelated',
    transform: 'scale(7)',
    transformOrigin: 'top left'
  };

  return (
    <div className='player-container'>
      {isJumping || jumpingFrame > 0 ? (
        <div
          style={{
            width: `15px`,
            height: `23px`,
            backgroundImage: 'url(/player/jump/jump_spritesheet.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: `-${jumpingFrame * 15 + 1}px 0`,
            transform: 'scale(7)',
            imageRendering: 'pixelated',
            transformOrigin: 'top left'
          }}
        />
      ) : isWalking ? (
        <div style={walkingStyle} />
      ) : (
        <div
          onClick={onClick}
          className={`player ${onCustomization ? '' : 'scale pointer customize'}`}
          style={{
            width: '91px',
            height: '154px',
            imageRendering: 'pixelated',
            backgroundImage: "url('./player/idle/player_sprite.png')",
            backgroundSize: '91px 154px',
            backgroundPosition: '-0px 0px',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>)}

    </div>
  );
}

export default Player;