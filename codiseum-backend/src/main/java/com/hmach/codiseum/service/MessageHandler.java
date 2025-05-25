package com.hmach.codiseum.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hmach.codiseum.dto.GameDTO;
import com.hmach.codiseum.dto.GamePlayerDTO;
import com.hmach.codiseum.dto.messages.BattleRequestMessage;
import com.hmach.codiseum.dto.messages.UserDataMessage;
import com.hmach.codiseum.model.User;
import com.hmach.codiseum.utils.WebSocketSessionUtils;
import com.fasterxml.jackson.core.type.TypeReference;

@Component
public class MessageHandler {

    @Autowired
    private PlayerManager playerManager;

    @Autowired
    private UserService userService;

    @Autowired
    private GameManager gameManager;

    @Autowired
    private WebSocketSessionUtils webSocketSessionUtils;

    public void handleConnection(WebSocketSession session) {
        playerManager.addPlayer(session);
    }

    public void handleMessage(WebSocketSession session, TextMessage message) {
        String payload = message.getPayload();

        try {
            Map<String, Object> messageMap = convertPayloadToMap(payload);

            if (messageMap == null || !messageMap.containsKey("type")) {
                return;
            }

            String messageType = (String) messageMap.get("type");
            switch (messageType) {
                case "userData":
                    handleUserDataMessage(session, messageMap);
                    break;
                case "solution":
                    handleSolutionMessage(session, messageMap);
                    break;
                case "gameEnd":
                    handleGameEndMessage(session, messageMap);
                    break;
                case "battleRequest":
                    handleBattleRequestMessage(session, messageMap);
                    break;
                case "enterQueue":
                    handleEnterQueueMessage(session, messageMap);
                    break;
                case "quitQueue":
                    handleQuitQueueMessage(session, messageMap);
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
        }
    }

    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {

    }

    private Map<String, Object> convertPayloadToMap(String payload) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(payload, new TypeReference<Map<String, Object>>() {
            });
        } catch (IOException e) {
            return null;
        }
    }

    private void handleUserDataMessage(WebSocketSession session, Map<String, Object> messageMap) {
        /// Obtener el nombre de usuario
        String newUsername = (String) messageMap.get("username");

        /// Obtener el jugador y crear mensaje
        String googleId = (String) session.getAttributes().get("googleId");
        User user = userService.getUserByGoogleId(googleId);
        UserDataMessage userDataMessage = new UserDataMessage();

        if (!newUsername.matches("^[a-zA-Z0-9._]{4,16}$")) {
            /// TODO: Nombre inválido
            userDataMessage.setUsername(null);
            webSocketSessionUtils.sendMessage(session, userDataMessage);
            return;
        }

        /// No cambiar si el nombre recibido es igual al actual
        if (newUsername.equals(user.getUsername())) {
            /// TODO: No cambiar nombre
            webSocketSessionUtils.sendMessage(session, userDataMessage);
            return;
        }

        /// Actualizar el nombre si no está siendo usado
        if (userService.getUserByUsername(newUsername) != null) {
            webSocketSessionUtils.sendMessage(session, userDataMessage);
            return;
        }

        userDataMessage.setUsername(newUsername);
        userDataMessage.setPoints(user.getPoints());
        userDataMessage.setLeague(user.getLeague().toString());
        userDataMessage.setRole(user.getRole().toString());
        userService.updateUsernameByUsername(user.getUsername(), newUsername);

        webSocketSessionUtils.sendMessage(session, userDataMessage);
    }

    private void handleSolutionMessage(WebSocketSession session, Map<String, Object> messageMap) {
        String googleId = (String) session.getAttributes().get("googleId");
        User senderUser = userService.getUserByGoogleId(googleId);
        GamePlayerDTO gamePlayer = playerManager.getPlayerByGoogleId(googleId);
        String content = (String) messageMap.get("content");

        if (senderUser == null) {
            return;
        }

        if (gamePlayer == null) {
            return;
        }

        GameDTO currentGame = gamePlayer.getCurrentGame();

        if (currentGame == null) {
            return;
        }

        if (content != null && content.length() > 400) {
            content = content.substring(0, 300);
        }

        currentGame.solve(gamePlayer, content);

        /// Buscar el jugador que envió la solución y la partida en la que se encuentra
        GamePlayerDTO solutionSender = playerManager.getPlayerBySession(session);
        GameDTO gameFound = gameManager.getGameByPlayer(solutionSender);

        /// Verificar si la partida acabó
        if (gameFound.isFinished()) {
            gameManager.endGame(gameFound, true);
        }
    }

    private void handleGameEndMessage(WebSocketSession session, Map<String, Object> messageMap) {

        String googleId = (String) session.getAttributes().get("googleId");

        User senderUser = userService.getUserByGoogleId(googleId);

        if (senderUser == null) {
            return;
        }

        GamePlayerDTO gamePlayerSender = playerManager.getPlayerByGoogleId(googleId);
        GameDTO currentGame = gameManager.getGameByPlayer(gamePlayerSender);

        if (currentGame == null) {
            return;
        }

        gameManager.endGame(currentGame, false);
    }

    private void handleBattleRequestMessage(WebSocketSession session, Map<String, Object> messageMap) {
        /// Obtener el estado de la petición, usuario retador y usuario retado
        String opponentUsername = (String) messageMap.get("opponentUsername");
        String senderGoogleId = (String) session.getAttributes().get("googleId");
        Boolean accepted = (Boolean) messageMap.get("accepted");

        User senderUser = userService.getUserByGoogleId(senderGoogleId);
        User opponentUser = userService.getUserByUsername(opponentUsername);

        if (opponentUser == null) {
            return;
        }

        GamePlayerDTO senderPlayer = playerManager.getPlayerByGoogleId(senderGoogleId);
        GamePlayerDTO opponentPlayer = playerManager.getPlayerByGoogleId(opponentUser.getGoogleId());

        if (accepted == null) {

            if (opponentPlayer.getBattleRequest().contains(senderUser.getUsername())) {
                /// TODO: Ya has retado a este jugador
                return;

            } else {
                /// Añadir solicitud de batalla
                /// TODO: Retar jugador

                if (senderUser.getUsername().equals(opponentUsername)) {
                    return;
                }

                opponentPlayer.getBattleRequest().add(senderUser.getUsername());
                BattleRequestMessage message = new BattleRequestMessage(senderUser.getUsername());
                webSocketSessionUtils.sendMessage(opponentPlayer.getSession(), message);
                return;
            }

        }

        if ((accepted == true) && (senderPlayer.getBattleRequest().contains(opponentUsername))) {

            senderPlayer.getBattleRequest().remove(opponentUsername);
            gameManager.startBattle(opponentPlayer, opponentUsername, senderPlayer, senderUser.getUsername());

        } else if ((accepted == false) && (senderPlayer.getBattleRequest().contains(opponentUsername))) {

            senderPlayer.getBattleRequest().remove(opponentUsername);

        }

    }

    private void handleEnterQueueMessage(WebSocketSession session, Map<String, Object> messageMap) {
        String senderGoogleId = (String) session.getAttributes().get("googleId");
        playerManager.addToQueue(senderGoogleId);
    }

    private void handleQuitQueueMessage(WebSocketSession session, Map<String, Object> messageMap) {
        GamePlayerDTO player = playerManager.getPlayerBySession(session);
        playerManager.removeFromQueue(player);
    }

    public void handleDisconnection(WebSocketSession session, CloseStatus status) {

        String googleId = (String) session.getAttributes().get("googleId");

        User senderUser = userService.getUserByGoogleId(googleId);

        if (senderUser == null) {
            return;
        }

        GamePlayerDTO gamePlayerDisconnected = playerManager.getPlayerByGoogleId(googleId);

        if (gamePlayerDisconnected == null) {
        }

        GameDTO currentGame = gameManager.getGameByPlayer(gamePlayerDisconnected);

        if (currentGame == null) {
            return;
        }

        gameManager.endGame(currentGame, false);
        playerManager.removePlayer(gamePlayerDisconnected);
    }
}