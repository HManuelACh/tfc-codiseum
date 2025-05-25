package com.hmach.codiseum.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BattleDTO {
    private Long id;

    private Long player1Id;
    private String player1Username;

    private Long player2Id;
    private String player2Username;

    private Long winnerId;

    private Long challengeId;
    private String challengeName;

    private String solution1;
    private String solution2;

    private int points1;
    private int points2;
}