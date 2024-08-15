package com.lec.spring.controller;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import com.lec.spring.domain.UserDTO;
import com.lec.spring.service.FriendService;
import com.lec.spring.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    private final FriendService friendService;

    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, FriendService friendService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.friendService = friendService;
        this.passwordEncoder = passwordEncoder;
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

    @PostMapping("/addinfo")
    public String addInfo(@RequestParam String username
            , @RequestParam String gender
            , @RequestParam String birthDay) {

//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//
//        LocalDate birthday;
//
//        try {
//            birthday = LocalDate.parse(birthDay, formatter);
//        } catch (DateTimeParseException e) {
//            return "Invalid date format";
//        }

        String response = userService.OAuthAddInfo(username, gender, birthDay);

        return response;
    }

    @PostMapping("/user-update/{id}")
    public User updateUser(@PathVariable Long id,
                           @RequestBody Map<String, String> updatedUserInfo) {
        try {
            User user = userService.findById(id);

            // 사용자가 없는 경우
            if (user == null){
                System.out.println("사용자 정보 없음 : " + id);
                return null;
            }

            // 업데이트
            String name = updatedUserInfo.get("name");
            String gender = updatedUserInfo.get("gender");
            String birthDay = updatedUserInfo.get("birthDay");
            String password = updatedUserInfo.get("password");

            if (name != null) {
                user.setName(name);
                System.out.println("setName:" + name);
            }
            if (gender != null) {
                user.setGender(gender);
                System.out.println("setGender:" + gender);
            }
            if (birthDay != null) {
                try {
                    user.setBirthDay(LocalDate.parse(birthDay));
                    System.out.println("setBirthDay:" + birthDay);
                } catch (DateTimeParseException e) {
                    // 잘못된 날짜인 경우
                    return null;
                }
            }
            if (password != null) {
//                if()
                user.setPassword(passwordEncoder.encode(password));
                System.out.println("setPassword:" + password);
            }

            User updateUser = userService.update(user);

//            System.out.println("유저정보 수정 완료");
//            System.out.println("update User 정보 : " + user);
            return updateUser;

        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public static void main(String[] args){
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "1234";
        String encodedPassword = encoder.encode(password);
        System.out.println(encodedPassword);
    }
}
