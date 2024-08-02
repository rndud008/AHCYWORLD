package com.lec.spring.service;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import com.lec.spring.repository.FriendRepository;
import org.springframework.stereotype.Service;

@Service
public class FriendService {

    private final FriendRepository friendRepository;

    public FriendService(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    public Friend findByUserAndFriendUser(User user, User friendUser){

        return friendRepository.findByUserAndFriendUser(user,friendUser).orElse(null);
    }
}
