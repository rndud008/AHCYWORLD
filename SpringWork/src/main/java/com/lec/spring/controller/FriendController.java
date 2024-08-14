package com.lec.spring.controller;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import com.lec.spring.service.FriendService;
import com.lec.spring.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friend")
public class FriendController {

    private final UserService userService;
    private final FriendService friendService;

    public FriendController(UserService userService, FriendService friendService) {
        this.userService = userService;
        this.friendService = friendService;
    }

    @GetMapping("/myfriends")
    public List<Friend> friendList(@RequestParam(value = "username") String username) {
        User user = userService.findByUsername(username.toUpperCase());

        List<Friend> friendList = friendService.findFriendsById(user.getId());

        System.out.println(friendList);

        return friendList;
    }

    @GetMapping("/check-friendship")
    public Map<String, Boolean> checkFriendship(@RequestParam(value = "username") String username, @RequestParam(value = "friendUsername") String friendUsername) {
        Map<String, Boolean> response = new HashMap<>();

        try {
            User user = userService.findByUsername(username.toUpperCase());
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

        User user = userService.findByUsername(username.toUpperCase());
        User friendUser = userService.findByUsername(friendUsername.toUpperCase());

        String response = friendService.addFriend(friendType1, friendType2, message, user, friendUser);


        return response;
    }

    @GetMapping("/friend-requests")
    public List<Friend> friendRequests(String username) {
        List<Friend> response = friendService.friendRequests(username);

        System.out.println(response);
        return response;
    }

    @PostMapping("/friend-response")
    public Friend friendShipResponse(Long id, String reply) {
        return friendService.friendShipResponse(id, reply);
    }

    // 일촌명 변경
    @PostMapping("/change-friend-name")
    public ResponseEntity<?> changeFriendName(@RequestParam Long friendId, @RequestParam String newFriendName) {
        try {
            friendService.changeFriendName(friendId, newFriendName);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // 일촌 끊기
    @DeleteMapping("/remove-friend/{userId}/{friendUserId}")
    public ResponseEntity<?> removeFriend(@PathVariable("friendUserId") Long friendUserId, @PathVariable("userId") Long userId) {
        try {
            friendService.removeFriend(friendUserId, userId);
            return ResponseEntity.ok().build(); // 상태 코드 200 OK
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Friend relationship not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }



}

