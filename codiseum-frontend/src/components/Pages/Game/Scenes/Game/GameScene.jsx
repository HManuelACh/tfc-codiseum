import React, { useEffect, useRef, useState } from 'react';
import './GameScene.scss';
import { useTheme } from '../../../../../context/ThemeProvider';
import { GameEndMessage, SolutionMessage } from '../../../../../model/Message';

import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state';
import { html } from '@codemirror/lang-html';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { oneDark } from '@codemirror/theme-one-dark';
import { Compartment } from '@codemirror/state';
import env from '../../../../../env';

function GameScene({ gameData, username, socketRef, scene, setScene }) {
  const { themeColors } = useTheme();

  const [timeLeft, setTimeLeft] = useState(gameData.challengeDuration);
  const editorRef = useRef(null);
  const editorViewRef = useRef(null);
  const [isSolutionSent, setIsSolutionSent] = useState(false);

  const readOnlyCompartment = useRef(new Compartment());

  const [isShowingPreview, setIsShowingPreview] = useState(false);

  const togglePreviewRef = useRef(null);

  const formattedTime = timeLeft >= 60
    ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')} min`
    : `${timeLeft} s`;

  const handleQuit = () => {
    if (gameData.completed) {
      setScene("home");
    } else {
      if (socketRef.current) {
        const message = new GameEndMessage();
        socketRef.current.send(JSON.stringify(message.toJson()));
      }
    }
  }

  useEffect(() => {
    if (gameData.completed) {
      setTimeLeft(0);
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + gameData.challengeDuration * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.round((endTime - now) / 1000));
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timer);
      }
    }, 250);

    return () => clearInterval(timer);
  }, [gameData.challengeDuration, gameData.completed]);

  useEffect(() => {
    if (!editorRef.current) return;

    const docText = "<body>\n  \n</body>";
    const cursorPos = docText.indexOf('  ') + 2;

    editorViewRef.current = new EditorView({
      state: EditorState.create({
        doc: docText,
        selection: EditorSelection.create([
          EditorSelection.cursor(cursorPos)
        ]),
        extensions: [
          lineNumbers(),
          history(),
          keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
          html(),
          oneDark,
          EditorView.theme({
            '&': { height: '100%' },
            '.cm-scroller': { overflow: 'auto', height: '100%' },
          }),
          readOnlyCompartment.current.of(EditorView.editable.of(true)) // editable por defecto
        ],
      }),
      parent: editorRef.current,
    });

    editorViewRef.current.focus();

    return () => editorViewRef.current?.destroy();
  }, []);

  useEffect(() => {
    const shouldBeEditable = !(isSolutionSent || gameData.completed);

    if (editorViewRef.current) {
      editorViewRef.current.dispatch({
        effects: readOnlyCompartment.current.reconfigure(EditorView.editable.of(shouldBeEditable))
      });
    }
  }, [isSolutionSent, gameData.completed]);

  const handleSendSolution = () => {

    if (!editorViewRef.current) return;

    const editorContent = editorViewRef.current.state.doc.toString();

    const content = new SolutionMessage(editorContent);

    socketRef.current.send(JSON.stringify(content.toJson()));

    setIsSolutionSent(true);

  }

  const handleTogglePreview = () => {
    setIsShowingPreview(!isShowingPreview);
    togglePreviewRef.current.classList.toggle("enabled");
  }

  return (
    <div className='game-scene'
      style={{
        backgroundColor: `${themeColors[3]}`
      }}
    >

      <div className='challenge-name-container'>
        <p className='challenge-name'>{gameData.challengeName}</p>
        <div
          onClick={handleQuit}
          className="button scale quit"
        ></div>
      </div>

      <div className='game-container'
        style={{
          border: `7px solid ${themeColors[0]}`,
        }}
      >

        <div className='player-container'>
          <div className='player-name-container'>
            <p className='player-name'
              style={{
                borderBottom: `7px solid ${themeColors[0]}`,
                backgroundColor: `${themeColors[2]}`
              }}
            >
              {username}
            </p>

            <div
              onClick={handleTogglePreview}
              className="button scale preview"
              ref={togglePreviewRef}
            ></div>
          </div>

          <div className='editor-container'>
            <div
              ref={editorRef}
              className='editor'
            ></div>

            {isShowingPreview && (
              <div className='solution-preview'>
                <iframe
                  className='content'
                  title="preview"
                  srcDoc={editorViewRef.current?.state.doc.toString() || '<body></body>'}
                  sandbox=""
                />
              </div>
            )}
          </div>

        </div>

        <div
          className='challenge-container'
          style={{
            borderLeft: `7px solid ${themeColors[0]}`,
            borderRight: `7px solid ${themeColors[0]}`,
            backgroundColor: `${themeColors[3]}`
          }}
        >

          <div

            className='countdown-bar-container'
            style={{
              height: '60px',
              border: `7px solid ${themeColors[0]}`,
              backgroundColor: `${themeColors[1]}`,
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
            <div
              className='countdown-bar'
              style={{
                width: `${(timeLeft / gameData.challengeDuration) * 100}%`,
                height: '100%',
                backgroundColor: `${themeColors[2]}`,
              }}
            >

            </div>
            <span className='countdown-text'>{formattedTime}</span>
          </div>

          <img
            className='challenge-image'
            src={(gameData) ? `${env.BACKEND_URL}/api/challenges/image/${gameData.challengeId}` : ''}
            alt={`Challenge ${gameData.challengeId}`}
          />

          {(!isSolutionSent && !gameData.completed) && (

            <div
              onClick={handleSendSolution}
              className="button scale send"
              style={{
                width: '252px',
                height: '112px',
                imageRendering: 'pixelated',
                backgroundImage: "url('./icons/icons_spritesheet2.png')",
                backgroundSize: '980px 112px',
                backgroundPosition: '-476px 0px',
                backgroundRepeat: 'no-repeat'
              }}
            ></div>)}

          {gameData.completed ? (
            <>
              <p>Puntos obtenidos</p>
              <br />
              {`${gameData.points} VS ${gameData.opponentPoints}`}
            </>
          ) : null}

        </div>

        <div className='opponent-container'>
          <p className='player-name'
            style={{
              borderBottom: `7px solid ${themeColors[0]}`,
              backgroundColor: `${themeColors[2]}`
            }}
          >
            {gameData.opponentUsername}
          </p>
          <div className='opponent-preview'>
            {(!gameData.completed) ? "Esperando a tu oponente..." : ""}
          </div>

        </div>

      </div>

      <div className='hints-container'>

      </div>

    </div>
  );
}

export default GameScene;