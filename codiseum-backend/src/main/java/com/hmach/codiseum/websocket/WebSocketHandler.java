package com.hmach.codiseum.websocket;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.hmach.codiseum.service.MessageHandler;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private MessageHandler messageHandler;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            messageHandler.handleConnection(session);
        } catch (ResponseStatusException ex) {
            try {
                session.close(CloseStatus.NOT_ACCEPTABLE.withReason(ex.getReason()));
            } catch (IOException e) {
            }
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        messageHandler.handleMessage(session, message);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        messageHandler.handleDisconnection(session, status);
    }
}