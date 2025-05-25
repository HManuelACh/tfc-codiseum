package com.hmach.codiseum.dto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.hmach.codiseum.model.Challenge;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Setter
@Getter
public class GameDTO {

    private String gameId;
    private GamePlayerDTO player1;
    private GamePlayerDTO player2;
    private String player1Solution = null;
    private String player2Solution = null;
    private int player1Points;
    private int player2Points;
    private String solution;
    private String allowedTags;
    private GamePlayerDTO winner;
    private Challenge challenge;
    private boolean isFinished;

    public GameDTO() {
        this.gameId = UUID.randomUUID().toString();;
    }

    public GameDTO(GamePlayerDTO player1, GamePlayerDTO player2, Challenge challenge, String solution, String allowedTags) {

        this.gameId = UUID.randomUUID().toString();
        this.player1 = player1;
        this.player2 = player2;
        this.challenge = challenge;
        this.solution = solution;
        this.allowedTags = allowedTags;

    }

    public void solve(GamePlayerDTO player, String solution) {
        
        if ((player == player1) && (player1Solution == null)) {
            player1Solution = solution;
        } else if ((player == player2) && (player2Solution == null)) {
            player2Solution = solution;
        }

        if ((player1Solution != null) && (player2Solution != null)) {
            isFinished = true;
        }
    }

    public List<GamePlayerDTO> getOnlinePlayers() {
        List<GamePlayerDTO> onlinePlayers = new ArrayList<>();

        if (this.player1.getSession().isOpen()) {
            onlinePlayers.add(player1);
        }

        if (this.player2.getSession().isOpen()) {
            onlinePlayers.add(player2);
        }

        return onlinePlayers;
    }

    public List<GamePlayerDTO> getPlayers() {
        return List.of(this.player1, this.player2);
    }

    public boolean contains(GamePlayerDTO GamePlayerDTO) {
        if ((this.player1.equals(GamePlayerDTO)) || (this.player2.equals(GamePlayerDTO))) {
            return true;
        }
        return false;
    }

    public List<String> getAllowedTags() {
        if (allowedTags == null || allowedTags.isEmpty()) {
            return List.of();
        }
        return Arrays.stream(allowedTags.split(","))
                     .map(String::trim)
                     .collect(Collectors.toList());
    }

}