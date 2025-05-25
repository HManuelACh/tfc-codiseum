package com.hmach.codiseum.controller;

import com.hmach.codiseum.dto.UpdateUserDTO;
import com.hmach.codiseum.dto.UserDTO;
import com.hmach.codiseum.dto.UserDTOFull;
import com.hmach.codiseum.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public ResponseEntity<List<UserDTOFull>> getAllUsers() {
        List<UserDTOFull> users = userService.getAllUsersFull();
        return ResponseEntity.ok(users);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<UserDTOFull> getUserById(@PathVariable Long id) {
        UserDTOFull user = userService.getUserByIdFull(id);
        return ResponseEntity.ok(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTOFull> updateUserById(@PathVariable Long id, @RequestBody UpdateUserDTO userDTO) {
        UserDTOFull updatedUser = userService.updateUserByIdFull(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserById(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @DeleteMapping("/delete/me")
    public ResponseEntity<Void> deleteCurrentUser() {
        userService.deleteCurrentUser();
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Map<String, Object> userData = userService.getCurrentUserInfo();
        return ResponseEntity.ok(userData);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/top")
    public ResponseEntity<List<UserDTO>> getAllUsersTop() {
        return ResponseEntity.ok(userService.getAllUsersTop());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/ban")
    public ResponseEntity<UserDTOFull> banPlayer(@PathVariable Long id) {
        UserDTOFull bannedUser = userService.banPlayer(id);
        return ResponseEntity.ok(bannedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/unban")
    public ResponseEntity<UserDTOFull> unbanPlayer(@PathVariable Long id) {
        UserDTOFull unbannedUser = userService.unbanPlayer(id);
        return ResponseEntity.ok(unbannedUser);
    }
}