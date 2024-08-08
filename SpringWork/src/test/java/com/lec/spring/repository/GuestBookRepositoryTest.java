package com.lec.spring.repository;

import com.lec.spring.domain.Diary;
import com.lec.spring.domain.GuestBook;
import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GuestBookRepositoryTest {

    @Autowired
    private GuestBookRepository guestBookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HompyRepository hompyRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private DiaryRepository diaryRepository;

    @Test
    void test(){
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

        Hompy hompy = Hompy.builder()
                .user(user1)
                .title("My Hompy")
                .profilePicture("profile.jpg")
                .statusMessage("Hello!")
                .minimiPicture("aaa.png")
                .build();

        Hompy hompy2 = Hompy.builder()
                .user(user2)
                .title("My Hompy2")
                .profilePicture("profile1.jpg")
                .statusMessage("Hello! my World")
                .minimiPicture("bbb.png")
                .build();

        Hompy hompy3 = Hompy.builder()
                .user(admin1)
                .title("My Hompy3")
                .profilePicture("profile2.jpg")
                .statusMessage("Hello! my World!!Come on~")
                .minimiPicture("ccc.png")
                .build();

        hompyRepository.saveAllAndFlush(List.of(hompy, hompy2, hompy3));

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

        diaryRepository.saveAllAndFlush(List.of(diary, diary2, diary3));

        GuestBook guestBook1 = GuestBook.builder()
                .id(1L)
                .status("show")
                .user(user1)
                .hompy(hompy)
                .content("방명록 test")
                .guestBookName("방명록")
                .build();

        GuestBook guestBook2 = GuestBook.builder()
                .id(2L)
                .status("hidden")
                .user(user2)
                .hompy(hompy2)
                .content("방명록 test2")
                .guestBookName("방명록")
                .build();

        GuestBook guestBook3 = GuestBook.builder()
                .id(3L)
                .status("show")
                .user(admin1)
                .hompy(hompy3)
                .content("방명록 test2")
                .guestBookName("방명록")
                .build();

        guestBookRepository.saveAllAndFlush(List.of(guestBook1, guestBook2, guestBook3));
    }
    @Test
    void test1(){
        User user = userRepository.findByUsername("user4".toUpperCase());

        user.setPassword(passwordEncoder.encode("1234"));

        userRepository.saveAndFlush(user);
    }
}