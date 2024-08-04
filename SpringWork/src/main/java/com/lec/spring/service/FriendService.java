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

    public FriendService(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    public Friend findByUserAndFriendUser(User user, User friendUser) {

        return friendRepository.findByUserAndFriendUser(user, friendUser).orElse(null);
    }

    public List<Friend> findFriendsById(Long id) {
        List<Friend> myFriends = friendRepository.findByUserId(id);

        List<Friend> friends = new ArrayList<>();
        friends.addAll(myFriends);

        System.out.println(friends);

        return friends;
    }
}
