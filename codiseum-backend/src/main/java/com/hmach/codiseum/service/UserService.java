package com.hmach.codiseum.service;

import com.hmach.codiseum.dto.UpdateUserDTO;
import com.hmach.codiseum.dto.UserDTO;
import com.hmach.codiseum.dto.UserDTOFull;
import com.hmach.codiseum.model.User;

import java.util.List;
import java.util.Map;

public interface UserService {

    List<UserDTO> getAllUsers();
    List<UserDTOFull> getAllUsersFull();
    UserDTO getUserById(Long id);
    UserDTOFull getUserByIdFull(Long id);
    UserDTO updateUserById(Long id, UpdateUserDTO userDTO);
    UserDTOFull updateUserByIdFull(Long id, UpdateUserDTO userDTO);
    void deleteUser(Long id);
    void deleteCurrentUser();
    UserDTOFull banPlayer( Long id);
    UserDTOFull unbanPlayer(Long id);

    Map<String, Object> getCurrentUserInfo();
    User getUserByGoogleId(String googleId);
    User getUserByUsername(String username);
    String generateRandomUsername();
    void updateUsernameByUsername(String oldUsername, String newUsername);
    void updatePoints(String googleId, int points);
    User getUserByEmail(String email);
    List<UserDTO> getAllUsersTop();
    UserDTO registerUser(User user);
    void updateLastLogin(User user);

}
