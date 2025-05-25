import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { UserDataMessage } from '../model/Message';
import './UsernameElement.scss'

const UsernameElement = forwardRef((props, ref) => {

    const usernameInputRef = useRef(null);
    const { themeColors, username, setUsername, socketRef } = props;
    const [isChanging, setIsChanging] = useState(false);
    const [previousUsername, setPreviousUsername] = useState(username);
    const [isVerifying, setIsVerifying] = useState(false);
    const measurerRef = useRef(null);
    const usernameElementRef = useRef(null);
    const cursorRef = useRef(null);
    const usernameRef = useRef(null);
    const usernameDisplayRef = useRef(null);

    const sendUpdatedName = (event) => {

        if (usernameInputRef.current.value == previousUsername) {
            setIsChanging(false);
            return;
        }

        if (usernameInputRef.current) {

            const newName = usernameInputRef.current.value;
            const message = new UserDataMessage(newName);
            socketRef.current.send(JSON.stringify(message.toJson()));

        }

        setIsVerifying(true);
    };

    const saveUpdatedName = () => {
        setIsChanging(false);
        setIsVerifying(false);
    };

    const cancelUpdatedName = (event) => {
        setIsChanging(false);
        setIsVerifying(false);
        setUsername(previousUsername);
    };

    const handleUsernameChange = (event) => {
        setUsername?.(event.target.value);
    };

    const editName = (event) => {
        setIsChanging(true);
        handleWidth();
    };

    useImperativeHandle(ref, () => ({
        cancelUpdateName: cancelUpdatedName,
        saveUpdatedName: saveUpdatedName,
        stopVerifying: () => { setIsVerifying(false); }
    }));

    useEffect(() => {
        if (isChanging) {
            setPreviousUsername(username);
            usernameElementRef.current.classList.add("active");
            focusInput();
        } else {
            usernameElementRef.current.classList.remove("active");
        }
    }, [isChanging]);

    useEffect(() => {
        if (isChanging && usernameInputRef.current) {
            handleWidth();
        }
    }, [isChanging, username]);

    const handleWidth = (event) => {
        if (usernameInputRef.current) {
            measurerRef.current.textContent = usernameInputRef.current.value || "";
            usernameInputRef.current.style.width = measurerRef.current.offsetWidth + "px";
        }
    }

    const focusInput = (event) => {
        if (usernameElementRef.current && cursorRef.current
        ) {
            usernameElementRef.current.classList.add("active");
            cursorRef.current.classList.add("active");
            usernameInputRef.current.focus();
        }
    }

    const unfocusInput = (event) => {
        usernameElementRef.current.classList.remove("active");
    }

    const handleArrowKeys = (e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            const position = e.target.selectionStart;
        }
    };

    const handleCopy = (event) => {
        const fullUsername = `${username}`;
        navigator.clipboard.writeText(fullUsername);
        usernameRef.current.classList.add("copied");
        usernameDisplayRef.current.classList.add("copied");
    }

    const stopCopyBlink = () => {
        if (usernameRef.current.classList.contains("copied")) {
            usernameRef.current.classList.remove("copied");
        }

        if (usernameDisplayRef.current.classList.contains("copied")) {
            usernameDisplayRef.current.classList.remove("copied");
        }
    }

    return (
        <div className='username-element' onClick={focusInput} ref={usernameElementRef}>

            {isChanging
                ?
                <>
                    <span className='username-display'>
                        <span ref={measurerRef} className='measurer'></span>
                        <div className='username-container'>
                            <input maxLength={16} className='username-input' onBlur={unfocusInput} onInput={handleWidth} onChange={handleUsernameChange} readOnly={isVerifying} ref={usernameInputRef} value={username} />
                        </div>
                    </span>
                    <div
                        onClick={sendUpdatedName}
                        className="button scale save"
                    ></div>
                    <div
                        onClick={cancelUpdatedName}
                        className="button scale cancel"
                    ></div>
                </>
                :
                <>
                    <div
                        className="username-display"
                        data-username={username}
                        onClick={handleCopy}
                        ref={usernameDisplayRef}
                    >
                        <span className="username" ref={usernameRef} onAnimationEnd={stopCopyBlink}>
                            {(socketRef.current && socketRef.current.readyState === WebSocket.OPEN) ? username : "..."}
                        </span>
                    </div>

                    {(socketRef.current && socketRef.current.readyState === WebSocket.OPEN) &&
                        <div
                            onClick={editName}
                            className="button scale edit"
                        ></div>
                    }

                </>
            }

        </div>
    )
});

export default UsernameElement