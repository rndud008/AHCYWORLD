package com.lec.spring.repository;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@SpringBootTest
class PaymentHistoryRepositoryTest {

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;
    @Autowired
    private UserRepository userRepository;
    private final Random random = new Random();

    @Test
    void paymentTest() {
//        User user1 = userRepository.findById(1L).orElse(null);
//        User user2 = userRepository.findById(2L).orElse(null);
//        User user4 = userRepository.findById(4L).orElse(null);
//        User user5 = userRepository.findById(5L).orElse(null);
//        User user6 = userRepository.findById(6L).orElse(null);
//        User user7 = userRepository.findById(7L).orElse(null);
//        User user8 = userRepository.findById(8L).orElse(null);

        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new RuntimeException("No users found in the database.");
        }

        List<PaymentHistory> paymentHistories = IntStream.range(0, 400)
                .mapToObj(index -> {
                    int paymentAmount = (random.nextInt(10000) + 1) * 10; // 10000까지 랜덤 결제금액(10의배수)

                    return PaymentHistory.builder()
                            .user(users.get(random.nextInt(users.size()))) // 랜덤 유저
                            .friendUser(random.nextBoolean() ? users.get(random.nextInt(users.size())) : null) // 랜덤 친구 유저, null일 수도 있음
                            .merchantUid("mid" + (1000000 + random.nextInt(9000000))) // 랜덤 결제번호
                            .impUid("imp" + (1000000 + random.nextInt(9000000))) // 랜덤 주문 고유번호
                            .payment(paymentAmount) // 결제금액 설정
                            .acornCnt((paymentAmount / 100) * 10) // 도토리 개수 설정
//                            .createAt(generateRandomDateTime()) // 랜덤 시간 생성
                            .build();
                })
                .collect(Collectors.toList());

        paymentHistoryRepository.saveAllAndFlush(paymentHistories);
    }

    private LocalDateTime generateRandomDateTime() {
        int month = random.nextInt(8) + 1; // 1부터 8까지 랜덤 월
        int day = random.nextInt(28) + 1; // 1부터 28까지 랜덤 일 (28일까지 허용)
        int hour = random.nextInt(24); // 0부터 23까지 랜덤 시
        int minute = random.nextInt(60); // 0부터 59까지 랜덤 분
        return LocalDateTime.of(2024, Month.of(month), day, hour, minute);
    }

//
//
//        PaymentHistory paymentHistory1 = PaymentHistory.builder()
//                .user(user1)
//                .friendUser(user2)
//                .merchantUid("mid_1111111111111")
//                .impUid("imp_111111111111")
//                .acornCnt(100)
//                .payment(1000)
//                .build();
//
//        PaymentHistory paymentHistory2 = PaymentHistory.builder()
//                .user(user2)
//                .friendUser(user4)
//                .merchantUid("mid_2222222222222")
//                .impUid("imp_222222222222")
//                .acornCnt(1000)
//                .payment(10000)
//                .build();
//
//        PaymentHistory paymentHistory3 = PaymentHistory.builder()
//                .user(user4)
//                .friendUser(user5)
//                .merchantUid("mid_3333333333333")
//                .impUid("imp_333333333333")
//                .acornCnt(10000)
//                .payment(100000)
//                .build();
//
//        PaymentHistory paymentHistory4 = PaymentHistory.builder()
//                .user(user5)
//                .friendUser(user6)
//                .merchantUid("mid_4444444444444")
//                .impUid("imp_444444444444")
//                .acornCnt(200)
//                .payment(2000)
//                .build();
//
//        PaymentHistory paymentHistory5 = PaymentHistory.builder()
//                .user(user6)
//                .friendUser(user7)
//                .merchantUid("mid_5555555555555")
//                .impUid("imp_555555555555")
//                .acornCnt(2100)
//                .payment(21000)
//                .build();
//
//        PaymentHistory paymentHistory6 = PaymentHistory.builder()
//                .user(user7)
//                .friendUser(user8)
//                .merchantUid("mid_6666666666666")
//                .impUid("imp_666666666666")
//                .acornCnt(11100)
//                .payment(111000)
//                .build();
//
//        PaymentHistory paymentHistory7 = PaymentHistory.builder()
//                .user(user1)
//                .friendUser(null)
//                .merchantUid("mid_1234132412341")
//                .impUid("imp_123412341234")
//                .acornCnt(300)
//                .payment(3000)
//                .build();
//
//        PaymentHistory paymentHistory8 = PaymentHistory.builder()
//                .user(user2)
//                .friendUser(null)
//                .merchantUid("mid_1234123412342")
//                .impUid("imp_432143214321")
//                .acornCnt(3000)
//                .payment(30000)
//                .build();
//
//        PaymentHistory paymentHistory9 = PaymentHistory.builder()
//                .user(user4)
//                .friendUser(null)
//                .merchantUid("mid_4321432143214")
//                .impUid("imp_234523452345")
//                .acornCnt(400)
//                .payment(40000)
//                .build();
//
//        PaymentHistory paymentHistory10 = PaymentHistory.builder()
//                .user(user5)
//                .friendUser(null)
//                .merchantUid("mid_3456345634563")
//                .impUid("imp_345634563456")
//                .acornCnt(500)
//                .payment(50000)
//                .build();
//
//        PaymentHistory paymentHistory11 = PaymentHistory.builder()
//                .user(user6)
//                .friendUser(null)
//                .merchantUid("mid_4567456745674")
//                .impUid("imp_456745674567")
//                .acornCnt(100)
//                .payment(1000)
//                .build();
//
//        PaymentHistory paymentHistory12 = PaymentHistory.builder()
//                .user(user7)
//                .friendUser(null)
//                .merchantUid("mid_5678567856785")
//                .impUid("imp_567856785678")
//                .acornCnt(1000)
//                .payment(10000)
//                .build();
//
//        paymentHistoryRepository.saveAllAndFlush(List.of(paymentHistory1, paymentHistory2
//                , paymentHistory3, paymentHistory4, paymentHistory5
//                , paymentHistory6, paymentHistory7, paymentHistory8
//                , paymentHistory9, paymentHistory10, paymentHistory11, paymentHistory12));
}
