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
        User user1 = userRepository.findById(1L).orElse(null);
        User user2 = userRepository.findById(2L).orElse(null);
        User user3 = userRepository.findById(3L).orElse(null);

        Hompy hompy = Hompy.builder()
                .user(user1)
                .title("My Hompy")
                .profilePicture("profile.jpg")
                .statusMessage("Hello!")
                .build();

        Hompy hompy2 = Hompy.builder()
                .user(user2)
                .title("My Hompy2")
                .profilePicture("profile1.jpg")
                .statusMessage("Hello! my World")
                .build();

        Hompy hompy3 = Hompy.builder()
                .user(user3)
                .title("My Hompy3")
                .profilePicture("profile2.jpg")
                .statusMessage("Hello! my World!!Come on~")
                .build();
        hompyRepository.saveAndFlush(hompy);
        hompyRepository.saveAndFlush(hompy2);
        hompyRepository.saveAndFlush(hompy3);

        Diary diary = Diary.builder()
                .hompy(hompy)
                .content("test content")
                .keyWord("TEST")
                .eventDate(LocalDate.now())
                .build();

        Diary diary2 = Diary.builder()
                .hompy(hompy2)
                .content("test content2")
                .keyWord("TEST2")
                .eventDate(LocalDate.now())
                .build();

        Diary diary3 = Diary.builder()
                .hompy(hompy3)
                .content("test content3")
                .keyWord("TEST3")
                .eventDate(LocalDate.now())
                .build();

        diaryRepository.saveAndFlush(diary);
        diaryRepository.saveAndFlush(diary2);
        diaryRepository.saveAndFlush(diary3);

        System.out.println(diary);
    }
}
