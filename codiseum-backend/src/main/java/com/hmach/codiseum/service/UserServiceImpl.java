package com.hmach.codiseum.service;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;

import com.hmach.codiseum.dto.UpdateUserDTO;
import com.hmach.codiseum.dto.UserDTO;
import com.hmach.codiseum.dto.UserDTOFull;
import com.hmach.codiseum.enumeration.LeagueEnum;
import com.hmach.codiseum.exception.NotFoundException;
import com.hmach.codiseum.mapper.UserMapper;
import com.hmach.codiseum.model.CustomUserDetails;
import com.hmach.codiseum.model.User;
import com.hmach.codiseum.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    private static final String GUEST_PREFIX = "Guest";
    private static final int RANDOM_NUMBER_LENGTH = 6;

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toDto(users);
    }

    @Override
    public List<UserDTOFull> getAllUsersFull() {
        List<User> users = userRepository.findAll();
        return userMapper.toDtoFull(users);
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ese id"));
        return userMapper.toDto(user);
    }

    @Override
    public UserDTOFull getUserByIdFull(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ese id"));
        return userMapper.toDtoFull(user);
    }

    @Override
    public UserDTO updateUserById(Long id, UpdateUserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ese id"));
        existingUser.setUsername(userDTO.getUsername());
        userRepository.save(existingUser);

        return userMapper.toDto(existingUser);
    }

    @Override
    public UserDTOFull updateUserByIdFull(Long id, UpdateUserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado con ese id"));
        existingUser.setUsername(userDTO.getUsername());
        userRepository.save(existingUser);

        return userMapper.toDtoFull(existingUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró un usuario con ese id"));
        userRepository.delete(user);
    }

    @Override
    public void deleteCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("No se encontró un usuario con ese nombre"));
        userRepository.delete(user);
    }

    @Override
    public UserDTOFull banPlayer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró al jugador con ese id."));

        user.setEnabled(false);
        userRepository.save(user);

        return userMapper.toDtoFull(user);
    }

    @Override
    public UserDTOFull unbanPlayer(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("No se encontró al jugador con ese id."));

        user.setEnabled(true);
        userRepository.save(user);

        return userMapper.toDtoFull(user);
    }

    @Override
    public Map<String, Object> getCurrentUserInfo() {
        var auth = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No authenticated user");
        }

        if (auth.getPrincipal() instanceof CustomUserDetails userDetails) {
            User user = userDetails.getUser();
            return Map.of(
                    "id", user.getId(),
                    "name", user.getUsername(),
                    "email", user.getEmail(),
                    "league", user.getLeague(),
                    "role", user.getRole());
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid authentication type");
    }

    @Override
    public User getUserByGoogleId(String googleId) {
        return userRepository.findByGoogleId(googleId).orElse(null);
    }

    @Override
    public String generateRandomUsername() {
        Random random = new Random();
        String username;

        do {
            username = GUEST_PREFIX + random.nextInt((int) Math.pow(10, RANDOM_NUMBER_LENGTH));

        } while (userRepository.existsByUsername(username));

        return username;
    }

    @Override
    public void updateUsernameByUsername(String oldUsername, String newUsername) {
        User user = userRepository.findByUsernameNative(oldUsername).orElse(null);

        if (user == null) {
            return;
        }

        user.setUsername(newUsername);
        userRepository.save(user);
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsernameNative(username).orElse(null);
    }

    @Override
    public void updatePoints(String googleId, int points) {
        User user = userRepository.findByGoogleId(googleId).orElse(null);

        if (user == null) {
            return;
        }

        int newTotalPoints = user.getPoints() + points;
        user.setPoints(newTotalPoints);

        // Subir de liga
        LeagueEnum newLeague;
        if (newTotalPoints >= 2000) {
            newLeague = LeagueEnum.DIAMANTE;
        } else if (newTotalPoints >= 1500) {
            newLeague = LeagueEnum.ORO;
        } else if (newTotalPoints >= 1000) {
            newLeague = LeagueEnum.PLATA;
        } else {
            newLeague = LeagueEnum.BRONCE;
        }

        user.setLeague(newLeague);

        userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    @Override
    public List<UserDTO> getAllUsersTop() {
        List<User> topUsers = userRepository.findTop3ByPoints();

        return userMapper.toDto(topUsers);
    }

    @Override
    public UserDTO registerUser(User user) {
        User newUser = userRepository.save(user);
        return userMapper.toDto(newUser);
    }

    @Override
    public void updateLastLogin(User user) {
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
    }

}
