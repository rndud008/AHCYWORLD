package com.lec.spring.repository;

import com.lec.spring.domain.Diary;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class DiaryRepositoryTest {

    @Autowired
    private DiaryRepository diaryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HompyRepository hompyRepository;

    @Test
    void test() {
        User user = User.builder()
                .id(1L)
                .username("testuser")
                .password("password")
                .name("Test User")
                .email("aaa@aaa.com")
//                .birthDay(LocalDateTime.now())
                .gender("Male")
                .acorn(0L)
                .role("ROLE_MEMBER")
                .build();
        userRepository.saveAndFlush(user);

        Hompy hompy = Hompy.builder()
                .user(user)
                .title("My Hompy")
                .profilePicture("profile.jpg")
                .statusMessage("Hello!")
                .build();
        hompyRepository.saveAndFlush(hompy);

        Diary diary = Diary.builder()
                .hompy(hompy)
                .content("test content")
                .keyWord("TEST")
                .eventDate(LocalDate.now())
                .build();

        diaryRepository.saveAndFlush(diary);

        System.out.println(diary);
    }
}
