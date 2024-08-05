package com.lec.spring.controller;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.service.FriendService;
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
    private final FriendService friendService;

    public UserController(UserService userService, FriendService friendService) {
        this.userService = userService;
        this.friendService = friendService;
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
        else {

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

    @GetMapping("/friends")
    public List<Friend> friendList(@RequestParam String username) {
        User user = userService.findByUsername(username.toUpperCase());

        List<Friend> friendList = friendService.findFriendsById(user.getId());

        System.out.println(friendList);

        return friendList;
    }

    @GetMapping("/list")
    public List<User> list() {
        List<User> user = userService.list();
        return user;
    }

    @GetMapping("/check-friendship")
    public Map<String, Boolean> checkFriendship(@RequestParam String username, @RequestParam String friendUsername) {
        User user = userService.findByUsername(username.toUpperCase());

        List<Friend> friendList = friendService.findFriendsById(user.getId());

        Map<String, Boolean> response = new HashMap<>();
        friendList.forEach(friend -> {
            if (friend.getFriendUser().getName().equals(friendUsername)) {
                response.put("friend", true);
            } else {
                response.put("friend", false);
            }
        });
        return response;
    }
}
