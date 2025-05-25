package com.hmach.codiseum.repository;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hmach.codiseum.model.User;
            
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query(value = "SELECT * FROM users WHERE username = :username", nativeQuery = true)
    Optional<User> findByUsernameNative(@Param("username") String username);

    @Query(value = "SELECT * FROM users WHERE google_id = :google_id", nativeQuery = true)
    Optional<User> findByGoogleId(@Param("google_id") String googleId);

    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findByEmail(@Param("email") String email);

    @Query(value = "SELECT * FROM users ORDER BY points DESC LIMIT 3", nativeQuery = true)
    List<User> findTop3ByPoints();
}
