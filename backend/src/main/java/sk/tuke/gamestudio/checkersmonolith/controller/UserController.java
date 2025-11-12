package sk.tuke.gamestudio.checkersmonolith.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.tuke.gamestudio.checkersmonolith.entity.User;
import sk.tuke.gamestudio.checkersmonolith.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public User createOrUpdateUser(@RequestBody User request) {
        return userService.createOrUpdateUser(request.getNickname(), request.getAvatarUrl());
    }

    @GetMapping("/{nickname}")
    public User getUser(@PathVariable String nickname) {
        return userService.getUser(nickname);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping
    public void resetUsers() {
        userService.reset();
    }
}