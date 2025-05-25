package com.hmach.codiseum.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hmach.codiseum.model.Challenge;
            
@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    @Query(value = "SELECT * FROM challenges ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    Challenge getRandomChallenge();

}