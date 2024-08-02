package com.lec.spring.repository;

import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    void registerTest() {
        User admin1 = User.builder()
                .username("admin1".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER,ROLE_ADMIN")
                .birthDay(LocalDate.now())
                .email("sss@mail.com")
                .gender("MALE")
                .name("신우섭")
                .acorn(30000L)
                .build();


        User user1 = User.builder()
                .username("user1".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER")
                .birthDay(LocalDate.now())
                .email("www00@mail.com")
                .gender("FEMALE")
                .name("신")
                .acorn(1000L)
                .build();


        User user2 = User.builder()
                .username("user2".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER")
                .birthDay(LocalDate.now())
                .email("admin@mail.com")
                .gender("MALE")
                .name("우우")
                .acorn(300L)
                .build();


        userRepository.saveAllAndFlush(List.of(user1, user2, admin1));

        user1 = userRepository.findById(1L).orElse(null);
        user2 = userRepository.findById(2L).orElse(null);
        admin1 = userRepository.findById(3L).orElse(null);

        user1.setAcorn(300L);
        user2.setAcorn(1000L);
        admin1.setAcorn(10000L);

        userRepository.saveAllAndFlush(List.of(user1, user2, admin1));
    }


}