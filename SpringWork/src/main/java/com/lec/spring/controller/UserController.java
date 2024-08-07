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
        user = userService.join(user, null);
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
    public List<Friend> friendList(@RequestParam(value = "username") String username) {
        User user = userService.findByUsername(username);

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
    public Map<String, Boolean> checkFriendship(@RequestParam(value = "username") String username, @RequestParam(value = "friendUsername") String friendUsername) {
        Map<String, Boolean> response = new HashMap<>();

        try {
            User user = userService.findByUsername(username);
            if (user == null) {
                response.put("friend", false);
                return response;
            }

            List<Friend> friendList = friendService.findFriendsById(user.getId());

            boolean isFriend = false;
            for (Friend friend : friendList) {
                if (friend.getFriendUser() != null && friend.getFriendUser().getName().equals(friendUsername)) {
                    isFriend = true;
                    break;
                }
            }

            response.put("friend", isFriend);
        } catch (Exception e) {
            e.printStackTrace(); // 로그를 통해 예외 확인
            response.put("friend", false);
        }

        return response;
    }

    @PostMapping("/addfriend")
    public String addFriend(@RequestParam String friendType1
            , @RequestParam String friendType2
            , @RequestParam String message
            , @RequestParam String username
            , @RequestParam String friendUsername
    ) {
//        System.out.println("유저이름은: "+username);
//        System.out.println("친구이름은?" +friendUsername);
        User user = userService.findByUsername(username);
        User friendUser = userService.findByUsername(friendUsername);

        String response = friendService.addFriend(friendType1, friendType2, message, user, friendUser);




        return response;
    }
}
