package com.hmach.codiseum.repository;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hmach.codiseum.model.Battle;
            
@Repository
public interface BattleRepository extends JpaRepository<Battle, Long> {
    List<Battle> findByPlayer1IdOrPlayer2Id(Long player1Id, Long player2Id);
}