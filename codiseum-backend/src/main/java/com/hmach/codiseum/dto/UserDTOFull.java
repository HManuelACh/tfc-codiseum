package com.hmach.codiseum.dto;

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
public class UserDTOFull {

    private String id;
    private String username;
    private String email;
    private int points;
    private RoleEnum role;
    private LeagueEnum league;
    private boolean enabled;
}