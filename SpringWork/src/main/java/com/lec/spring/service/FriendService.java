package com.lec.spring.service;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import com.lec.spring.repository.FriendRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class FriendService {

    private final FriendRepository friendRepository;
    private final UserService userService;

    public FriendService(FriendRepository friendRepository, UserService userService) {
        this.friendRepository = friendRepository;
        this.userService = userService;
    }

    public Friend findByUserAndFriendUser(User user, User friendUser) {

        return friendRepository.findByUserAndFriendUser(user, friendUser).orElse(null);
    }

    public List<Friend> findFriendsById(Long id) {
        List<Friend> myFriends = friendRepository.findByUserId(id);

        List<Friend> friends = new ArrayList<>();
        for (Friend friend : myFriends) {
            if (friend.getFriendStatus().equals("accept")) {
                friends.add(friend);
            }
        }

//        System.out.println(friends);

        return friends;
    }

    public String addFriend(String friendType1, String friendType2, String message, User user, User friendUser) {

        Friend friend1 = Friend.builder()
                .user(user)
                .friendUser(friendUser)
                .friendName(friendType1)
                .userName(friendType2)
                .message(message)
                .friendStatus("waiting")
                .build();

        Friend friend2 = Friend.builder()
                .user(friendUser)
                .friendUser(user)
                .friendName(friendType2)
                .userName(friendType1)
                .message(message)
                .friendStatus("waiting")
                .build();

        friendRepository.saveAllAndFlush(List.of(friend1, friend2));

        return "ok";
    }

    public List<Friend> friendRequests(String username) {
        User user = userService.findByUsername(username);
        List<Friend> friendList = friendRepository.findAll();


        List<Friend> friendRequests = new ArrayList<>();

        for (Friend friend : friendList) {
            System.out.println("친구신청 아이디: " + friend.getFriendUser().getId());
            System.out.println("유저 아이디: " + user.getId());
            if (friend.getFriendUser().getId() == user.getId() && friend.getFriendStatus().equals("waiting")) {
                friendRequests.add(friend);
            }
        }
        System.out.println("friendRequests: " + friendRequests);

        return friendRequests;
    }

    public Friend friendShipResponse(Long id, String reply) {
        Friend friend = friendRepository.findById(id).orElse(null);
        List<Friend> friendList = friendRepository.findAll();
        Friend friendUser = new Friend();

        for (Friend requestUser : friendList) {
            if (requestUser.getUser().getId() == friend.getFriendUser().getId() && requestUser.getFriendUser().getId() == friend.getUser().getId()) {
                friendUser = requestUser;
                break;
            }

        }

        if (reply.equals("true")) {
            friend.setFriendStatus("accept");
            friendUser.setFriendStatus("accept");
        } else if (reply.equals("false")) {
            friend.setFriendStatus("reject");
            friendUser.setFriendStatus("reject");
        }

        return friendRepository.saveAndFlush(friend);
    }
}
