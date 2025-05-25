package com.hmach.codiseum.utils;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hmach.codiseum.dto.GameDTO;
import com.hmach.codiseum.dto.GamePlayerDTO;

@Component
public class WebSocketSessionUtils {
    
    public void sendMessage(WebSocketSession session, Object messageObject) {

        String googleId = (String) session.getAttributes().get("googleId");

        if (session != null && session.isOpen()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                // Convertir el objeto a JSON
                String jsonMessage = objectMapper.writeValueAsString(messageObject);
                // Enviar el mensaje como TextMessage
                session.sendMessage(new TextMessage(jsonMessage));
            } catch (IOException | IllegalStateException e) {
            }
        }
    }

    public void sendMessage(GameDTO gameDTO, Object messageObject) {

        List<GamePlayerDTO> players = gameDTO.getOnlinePlayers();

        for (GamePlayerDTO player : players) {
            sendMessage(player.getSession(), messageObject);
        } 
       
    }

}