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

        // 현재 존재하는 사용자 수를 가져옴
        List<User> existingUsers = userRepository.findAll();
        int existingUserCount = existingUsers.size();

        // 새로 추가할 사용자 수
        int newUserCount = 200;
        int startIndex = existingUserCount + 1;

        // 새로운 사용자 생성
        List<User> newUsers = IntStream.range(startIndex, startIndex + newUserCount)
                .mapToObj(index -> User.builder()
                        .username(("user" + index).toUpperCase())
                        .password(passwordEncoder.encode("1234"))
                        .role("ROLE_MEMBER")
                        .birthDay(LocalDate.now())
                        .email("user" + index + "@mail.com")
                        .gender(index % 2 == 0 ? "MALE" : "FEMALE")
                        .name("user" + index)
                        .acorn((long) (100 * Math.random()))
                        .build())
                .collect(Collectors.toList());

        // 랜덤 생성기 및 날짜 범위 설정
        LocalDate startDate = LocalDate.of(2023, 1, 1);
        LocalDate endDate = LocalDate.of(2023, 12, 31); // 2024년 8월까지 포함

        // 기존 사용자 목록을 갱신하여 날짜를 설정
        for (int i = 0; i < newUsers.size(); i++) {
            User user = newUsers.get(i);

            // 순서에 따라 날짜 조정
            LocalDate orderedDate = startDate.plusDays(i);

            // 날짜가 endDate를 넘어가면 endDate로 설정
            if (orderedDate.isAfter(endDate)) {
                orderedDate = endDate;
            }

            user.setCreateAt(orderedDate.atStartOfDay());
        }

        // 새 사용자 저장
        userRepository.saveAllAndFlush(newUsers);
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
            if (user.getId() >= 306) {
                LocalDate birthDate = generateRandomBirthDate(random);
                user.setBirthDay(birthDate);
                userRepository.save(user); // 사용자 업데이트 저장
            }
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
    void test3() {
//        List<User> users = userRepository.findByNameContainingIgnoreCase("a").orElse(null);
//
//        users.forEach(System.out::println);
//
//        System.out.println(users.size());
        User user = userRepository.findByUsername("ADMIN1");
        user.setAcorn(9000000L);
        userRepository.save(user);
    }
}