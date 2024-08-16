package com.lec.spring.repository;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;
    @Autowired
    HompyRepository hompyRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    @Test
    void registerTest() {

//        List<User> users = IntStream.range(8, 300)
//                .mapToObj(index -> User.builder()
//                        .username(("user" + index).toUpperCase())
//                        .password(passwordEncoder.encode("1234"))
//                        .role("ROLE_MEMBER")
//                        .birthDay(LocalDate.now())
//                        .email("user" + index + "@mail.com")
//                        .gender(index % 2 == 0 ? "MALE" : "FEMALE")
//                        .name("user" + index)
//                        .acorn((long) (100 * Math.random()))
//                        .build())
//                .collect(Collectors.toList());

        List<User> users = new ArrayList<>();

        users = userRepository.findAll();

        // 랜덤 생성기 및 기준 날짜 설정
        Random random = new Random();
        LocalDate startDate = LocalDate.of(2024, 1, 1);
        LocalDate endDate = LocalDate.of(2024, 8, 31);

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);

            // 순서에 따라 날짜 조정
            LocalDate orderedDate = startDate.plusDays(i);

            // 날짜가 endDate를 넘어가면 endDate로 설정
            if (orderedDate.isAfter(endDate)) {
                orderedDate = endDate;
            }

            user.setCreateAt(orderedDate.atStartOfDay());
        }

        userRepository.saveAllAndFlush(users);


//        User admin1 = User.builder()
//                .username("admin1".toUpperCase())
//                .password(passwordEncoder.encode("1234"))
//                .role("ROLE_MEMBER,ROLE_ADMIN")
//                .birthDay(LocalDate.now())
//                .email("sss@mail.com")
//                .gender("MALE")
//                .name("신우섭")
//                .acorn(30000L)
//                .build();
//
//
//        User user1 = User.builder()
//                .username("user1".toUpperCase())
//                .password(passwordEncoder.encode("1234"))
//                .role("ROLE_MEMBER")
//                .birthDay(LocalDate.now())
//                .email("www00@mail.com")
//                .gender("FEMALE")
//                .name("신")
//                .acorn(1000L)
//                .build();
//
//
//        User user2 = User.builder()
//                .username("user2".toUpperCase())
//                .password(passwordEncoder.encode("1234"))
//                .role("ROLE_MEMBER")
//                .birthDay(LocalDate.now())
//                .email("admin@mail.com")
//                .gender("MALE")
//                .name("우우")
//                .acorn(300L)
//                .build();
//
//
//        userRepository.saveAllAndFlush(List.of(user1, user2, admin1));
//
//        user1 = userRepository.findById(1L).orElse(null);
//        user2 = userRepository.findById(2L).orElse(null);
//        admin1 = userRepository.findById(3L).orElse(null);
//
//        user1.setAcorn(300L);
//        user2.setAcorn(1000L);
//        admin1.setAcorn(10000L);
//
//        userRepository.saveAllAndFlush(List.of(user1, user2, admin1));
    }

    @Test
    void updateTest() {
//        User user = userRepository.findById(5L).orElse(null);
//        Hompy hompy = hompyRepository.findByUser(user);
//        System.out.println("홈피아이디: " + hompy.getId());
//        String newPic = "망곰2.png";
//        hompy.setMinimiPicture(newPic);
//        hompyRepository.save(hompy);
//        System.out.println("저장 후 홈피: " + hompy);
//        User user = userRepository.findByUsername("ADMIN1");

//        Hompy hompy = Hompy.builder()
//                .user(user)
//                .profilePicture("파자마짱구.png")
//                .todayVisitor(20L)
//                .totalVisitor(20000L)
//                .minimiPicture("파자마짱구.png")
//                .miniRoom("스토리룸15")
//                .title("관리자의 미니홈피")
//                .build();

//        hompyRepository.saveAndFlush(hompy);

//        Hompy hompy1 = hompyRepository.findById(8L).orElse(null);
//
//        hompy1.setMenuColor("#147DAF,#FFF,#147DAF");
//        hompy1.setMenuStatus("visible,visible,visible,visible");
//        hompy1.setTodayVisitor(20L);
//        hompy1.setTotalVisitor(20000L);
//
//
//        hompyRepository.saveAndFlush(hompy1);

        List<User> users = userRepository.findAll();

        Random random = new Random();

        // 생년월일을 랜덤하게 생성하여 각 사용자에게 설정
        for (User user : users) {
            LocalDate birthDate = generateRandomBirthDate(random);
            user.setBirthDay(birthDate);
            userRepository.save(user); // 사용자 업데이트 저장
        }
    }

    // 랜덤 생년월일 생성 메서드
    private LocalDate generateRandomBirthDate(Random random) {
        int ageGroup = random.nextInt(5); // 0 ~ 4
        int year;
        switch (ageGroup) {
            case 0: // 10대
                year = 2004 + random.nextInt(10); // 2004 ~ 2014
                break;
            case 1: // 20대
                year = 1994 + random.nextInt(10); // 1994 ~ 2003
                break;
            case 2: // 30대
                year = 1984 + random.nextInt(10); // 1984 ~ 1993
                break;
            case 3: // 40대
                year = 1974 + random.nextInt(10); // 1974 ~ 1983
                break;
            case 4: // 50대
                year = 1964 + random.nextInt(10); // 1964 ~ 1973
                break;
            default:
                year = 2000; // 기본값 (실제로는 도달하지 않음)
        }

        // 월과 일 랜덤 생성
        int month = random.nextInt(12) + 1; // 1 ~ 12
        int day = random.nextInt(28) + 1; // 1 ~ 28 (간단화를 위해 28일로 설정)

        return LocalDate.of(year, month, day);
    }


    @Test
    void test3(){
        List<User> users = userRepository.findByNameContainingIgnoreCase("a").orElse(null);

        users.forEach(System.out::println);

        System.out.println(users.size());
    }
}