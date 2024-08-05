package com.lec.spring.repository;

import com.lec.spring.domain.Friend;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class FriendRepositoryTest {
    @Autowired
    UserRepository userRepository;
    @Autowired
    FriendRepository friendRepository;

    @Test
    void test() {
        User logUser = userRepository.findById(1L).get();

        User user2 = userRepository.findById(2L).get();
        User user3 = userRepository.findById(3L).get();
        User user4 = userRepository.findById(4L).get();
        User user5 = userRepository.findById(5L).get();
        User user6 = userRepository.findById(6L).get();
        User user7 = userRepository.findById(7L).get();


        Friend friend = Friend.builder()
                .friendUser(user3)
                .user(logUser)
                .friendName("노잼")
                .userName("핵노잼")
                .message("노잼노잼핵노잼")
                .friendStatus("waiting")
                .build();

        Friend friend1 = Friend.builder()
                .friendUser(logUser)
                .user(user3)
                .friendName("핵노잼")
                .userName("노잼")
                .message("노잼노잼핵노잼")
                .friendStatus("waiting")
                .build();

        Friend friend2 = Friend.builder()
                .friendUser(user4)
                .user(logUser)
                .friendName("잼민이")
                .userName("급식")
                .message("잼민잼민잼민이")
                .friendStatus("waiting")
                .build();


        Friend friend3 = Friend.builder()
                .friendUser(logUser)
                .user(user4)
                .friendName("급식")
                .userName("잼민이")
                .message("잼민잼민잼민이")
                .friendStatus("waiting")
                .build();

        Friend friend4 = Friend.builder()
                .friendUser(user5)
                .user(logUser)
                .friendName("호로롤")
                .userName("파르르르릉")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();

        Friend friend5 = Friend.builder()
                .friendUser(logUser)
                .user(user5)
                .friendName("파르르르릉")
                .userName("호로롤")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();

        Friend friend6 = Friend.builder()
                .friendUser(logUser)
                .user(user2)
                .friendName("파랑")
                .userName("빨강")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();
        Friend friend7 = Friend.builder()
                .friendUser(user2)
                .user(logUser)
                .friendName("빨강")
                .userName("파랑")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();
        Friend friend8 = Friend.builder()
                .friendUser(logUser)
                .user(user6)
                .friendName("사과")
                .userName("바나나")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();
        Friend friend9 = Friend.builder()
                .friendUser(user6)
                .user(logUser)
                .friendName("바나나")
                .userName("사과")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();
        Friend friend10 = Friend.builder()
                .friendUser(logUser)
                .user(user7)
                .friendName("키보드")
                .userName("노트북")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();
        Friend friend11 = Friend.builder()
                .friendUser(user7)
                .user(logUser)
                .friendName("노트북")
                .userName("키보드")
                .message("호롤호롤파르릉")
                .friendStatus("waiting")
                .build();

        friendRepository.saveAllAndFlush(List.of(friend, friend1, friend2, friend3, friend4, friend5,
                friend6, friend7, friend8, friend9, friend10, friend11));

    }

}