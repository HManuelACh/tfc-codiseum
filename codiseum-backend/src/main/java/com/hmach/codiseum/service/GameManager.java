package com.hmach.codiseum.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hmach.codiseum.dto.GameDTO;
import com.hmach.codiseum.dto.GamePlayerDTO;
import com.hmach.codiseum.dto.messages.EndGameMessage;
import com.hmach.codiseum.dto.messages.StartBattleMessage;
import com.hmach.codiseum.model.Challenge;
import com.hmach.codiseum.utils.WebSocketSessionUtils;

@Component
public class GameManager {

    @Autowired
    private WebSocketSessionUtils webSocketSessionUtils;

    @Autowired
    private ChallengeService challengeService;

    @Autowired
    private ScheduledExecutorService scheduler;

    @Autowired
    private HtmlSanitizer htmlSanitizer;

    @Autowired
    private HtmlComparator htmlComparator;

    @Autowired
    private UserService userService;

    @Autowired
    private BattleService battleService;

    private final List<GameDTO> gameChannels = new ArrayList<>();
    private final Map<GameDTO, ScheduledFuture<?>> gameTimers = new ConcurrentHashMap<>();

    public void startBattle(GamePlayerDTO player1, String player1Username, GamePlayerDTO player2,
            String player2Username) {
        /// Obtener reto aleatorio
        Challenge randomChallenge = challengeService.getRandomChallenge();

        /// Crear juego
        GameDTO newGame = new GameDTO(player1, player2, randomChallenge, randomChallenge.getSolution(),
                randomChallenge.getAllowedTags());
        player1.setCurrentGame(newGame);
        player2.setCurrentGame(newGame);

        gameChannels.add(newGame);

        /// Crear mensaje y notificar
        StartBattleMessage message1 = new StartBattleMessage(player2Username, randomChallenge.getId(),
                randomChallenge.getName(), randomChallenge.getDuration());

        StartBattleMessage message2 = new StartBattleMessage(player1Username, randomChallenge.getId(),
                randomChallenge.getName(), randomChallenge.getDuration());

        webSocketSessionUtils.sendMessage(player1.getSession(), message1);
        webSocketSessionUtils.sendMessage(player2.getSession(), message2);

        ScheduledFuture<?> future = scheduler.schedule(() -> {
            if (gameChannels.contains(newGame)) {
                // Aquí uso el nuevo método para completar el juego
                endGame(newGame, true);
            }
        }, randomChallenge.getDuration(), TimeUnit.SECONDS);

        gameTimers.put(newGame, future);
    }

    // Buscar partida por jugador
    public GameDTO getGameByPlayer(GamePlayerDTO playerToSearch) {
        return gameChannels.stream()
                .filter(game -> game.getPlayer1().equals(playerToSearch) || game.getPlayer2().equals(playerToSearch))
                .findFirst()
                .orElse(null);
    }

    public void endGame(GameDTO endedGame, boolean completed) {
        ScheduledFuture<?> future = gameTimers.remove(endedGame);
        if (future != null && !future.isDone()) {
            future.cancel(false);
        }

        EndGameMessage message = new EndGameMessage();

        if (completed) {
            /// Obtener soluciones propuestas
            String player1Solution = endedGame.getPlayer1Solution();
            String player2Solution = endedGame.getPlayer2Solution();

            player1Solution = (player1Solution == null) ? "" : player1Solution;
            player2Solution = (player2Solution == null) ? "" : player2Solution;

            String solution = endedGame.getSolution();
            List<String> allowedTags = endedGame.getAllowedTags();

            String sanitizedPlayer1Solution = htmlSanitizer.sanitize(player1Solution, allowedTags);
            String sanitizedPlayer2Solution = htmlSanitizer.sanitize(player2Solution, allowedTags);

            int player1Points = htmlComparator.calculateScore(solution, sanitizedPlayer1Solution);
            int player2Points = htmlComparator.calculateScore(solution, sanitizedPlayer2Solution);

            /// Actualizar puntos
            String player1GoogleId = (String) endedGame.getPlayer1().getSession().getAttributes().get("googleId");
            String player2GoogleId = (String) endedGame.getPlayer2().getSession().getAttributes().get("googleId");

            userService.updatePoints(player1GoogleId, player1Points);
            userService.updatePoints(player2GoogleId, player2Points);

            message.setReason("¡La partida terminó!");

            message.setPoints(player1Points);
            message.setOpponentPoints(player2Points);

            message.setCompleted(true);

            /// Enviar a jugador 1
            webSocketSessionUtils.sendMessage(endedGame.getPlayer1().getSession(), message);

            /// Enviar a jugador 2
            message.setPoints(player2Points);
            message.setOpponentPoints(player1Points);
            webSocketSessionUtils.sendMessage(endedGame.getPlayer2().getSession(), message);

            /// Determinar ganador
            GamePlayerDTO winner = player1Points > player2Points ? endedGame.getPlayer1()
                    : player2Points > player1Points ? endedGame.getPlayer2() : null;

            endedGame.setWinner(winner);
            endedGame.setPlayer1Points(player1Points);
            endedGame.setPlayer2Points(player2Points);

            /// Registrar partida
            battleService.registerBattle(endedGame);

        } else {
            message.setReason("Partida finalizada por rendición");
            webSocketSessionUtils.sendMessage(endedGame, message);
        }

        endedGame.getPlayer1().setCurrentGame(null);
        endedGame.getPlayer2().setCurrentGame(null);
        gameChannels.remove(endedGame);
    }

}
