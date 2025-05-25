package com.hmach.codiseum.dto.messages;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserDataMessage {
    private String type = "userData";
    private String username;
    private Integer points;
    private String league;
    private String role;

    public UserDataMessage(String username, Integer points, String league, String role) {
        this.username = username;
        this.points = points;
        this.league = league;
        this.role = role;
    }
}
