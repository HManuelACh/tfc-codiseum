package com.hmach.codiseum.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.socket.WebSocketSession;

import com.hmach.codiseum.dto.GamePlayerDTO;
import com.hmach.codiseum.dto.messages.ErrorMessage;
import com.hmach.codiseum.dto.messages.UserDataMessage;
import com.hmach.codiseum.model.User;
import com.hmach.codiseum.utils.WebSocketSessionUtils;

@Component
public class PlayerManager {

    @Autowired
    private WebSocketSessionUtils webSocketSessionUtils;

    private final List<GamePlayerDTO> players = new ArrayList<>();
    private final List<GamePlayerDTO> queue = new ArrayList<>();

    @Autowired
    private UserService userService;

    @Autowired
    private GameManager gameManager;

    // Añadir jugador
    public void addPlayer(WebSocketSession session) {
        // Obtener el nombre de usuario
        String googleId = (String) session.getAttributes().get("googleId");
        User user = userService.getUserByGoogleId(googleId);

        if (user == null) {
            try {
                ErrorMessage errorMessage = new ErrorMessage(
                        "invalidUser",
                        "Sesión inválida. Por favor inicia sesión nuevamente.");
                webSocketSessionUtils.sendMessage(session, errorMessage);
            } catch (Exception e) {
            }

            try {
                session.close();
            } catch (IOException e) {
            }

            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sesión no válida. Inicia sesión de nuevo.");
        }

        GamePlayerDTO existingGamePlayer = getPlayerByGoogleId(googleId);

        if (existingGamePlayer != null) {
            removePlayer(existingGamePlayer);
        }

        // Se crea un nuevo jugador y se agrega a la lista de jugadores
        GamePlayerDTO newPlayer = new GamePlayerDTO(session);
        players.add(newPlayer);

        // Se envían los datos del usuario
        UserDataMessage userDataMessage = new UserDataMessage(user.getUsername(), user.getPoints(),
                user.getLeague().toString(), user.getRole().toString());

        webSocketSessionUtils.sendMessage(session, userDataMessage);
    }

    // Eliminar jugador
    public void removePlayer(GamePlayerDTO player) {
        players.remove(player);
        queue.remove(player);

        /// DEBUG: Número de jugadores
    }

    public void addToQueue(String googleId) {

        GamePlayerDTO gamePlayer = getPlayerByGoogleId(googleId);

        if (!queue.contains(gamePlayer) && (gamePlayer.getCurrentGame() == null)) {
            queue.add(gamePlayer);
        }

        if (queue.size() >= 2) {
            GamePlayerDTO player1 = queue.remove(0);
            GamePlayerDTO player2 = queue.remove(0);

            String googleId1 = (String) player1.getSession().getAttributes().get("googleId");
            String googleId2 = (String) player2.getSession().getAttributes().get("googleId");

            User user1 = userService.getUserByGoogleId(googleId1);
            User user2 = userService.getUserByGoogleId(googleId2);

            gameManager.startBattle(player1, user1.getUsername(), player2, user2.getUsername());

        }
    }

    public void removeFromQueue(GamePlayerDTO player) {
        if (queue.contains(player)) {
            queue.remove(player);
        }
    }

    // Buscar por sesión
    public GamePlayerDTO getPlayerByGoogleId(String googleId) {
        return players.stream()
                .filter(player -> player.getSession().getAttributes().get("googleId").equals(googleId))
                .findFirst()
                .orElse(null);
    }

    // Buscar por sesión
    public GamePlayerDTO getPlayerBySession(WebSocketSession session) {
        return players.stream()
                .filter(player -> player.getSession().equals(session))
                .findFirst()
                .orElse(null);
    }

}