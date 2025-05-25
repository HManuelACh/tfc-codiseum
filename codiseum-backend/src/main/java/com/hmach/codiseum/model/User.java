package com.hmach.codiseum.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.hmach.codiseum.enumeration.LeagueEnum;
import com.hmach.codiseum.enumeration.RoleEnum;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;
    private String googleId;
    private String username;
    private String email;
    private RoleEnum role;
    private Integer points;
    private LeagueEnum league;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private boolean enabled;

}