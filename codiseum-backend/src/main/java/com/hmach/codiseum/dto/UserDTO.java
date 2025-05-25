package com.hmach.codiseum.dto;

import com.hmach.codiseum.model.User;
import com.hmach.codiseum.enumeration.RoleEnum;
import com.hmach.codiseum.enumeration.LeagueEnum;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class UserDTO {

    private String username;
    private int points;
    private RoleEnum role;
    private LeagueEnum league;

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.points = user.getPoints();
        this.role = user.getRole();
        this.league = user.getLeague();
    }
}