package com.lec.spring.controller;

import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/join")
    public String join(@RequestBody UserDTO joinUser) {
        User user = User.builder()
                .username(joinUser.getUsername().toUpperCase())
                .password(joinUser.getPassword())
                .email(joinUser.getEmail())
                .name(joinUser.getName())
                .gender(joinUser.getGender())
                .birthDay(LocalDate.parse(joinUser.getBirthDay()))
                .build();
        user = userService.join(user);
        if (user == null) return "JOIN FAILED";
        else{

            return "JOIN SUCCESS";
        }
    }

    @GetMapping("/check-username")
    public Map<String, Boolean> checkUsername(@RequestParam String username) {
        boolean available = userService.usernameAvailable(username);

        Map<String, Boolean> response = new HashMap<>();
        response.put("available", available);

        return response;
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean available = userService.emailAvailable(email);

        Map<String, Boolean> response = new HashMap<>();
        response.put("available", available);

        return response;
    }
}
