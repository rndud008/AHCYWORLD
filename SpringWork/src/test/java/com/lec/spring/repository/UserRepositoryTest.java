package com.lec.spring.repository;

import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    void registerTest() {
        User user1 = User.builder()
                .username("user1".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER")
                .birthDay(LocalDateTime.now())
                .email("sss@mail.com")
                .gender("MALE")
                .name("신우섭")
                .acorn(300L)
                .build();


        User user2 = User.builder()
                .username("user2".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER")
                .birthDay(LocalDateTime.now())
                .email("www00@mail.com")
                .gender("FEMALE")
                .name("신")
                .acorn(1000L)
                .build();


        User admin1 = User.builder()
                .username("admin1".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER,ROLE_ADMIN")
                .birthDay(LocalDateTime.now())
                .email("admin@mail.com")
                .gender("MALE")
                .name("우우")
                .acorn(30000L)
                .build();


        userRepository.saveAllAndFlush((List.of(user1, user2, admin1)));
//        userRepository.saveAllAndFlush(List.of(user1, user2, admin1));
    }


}