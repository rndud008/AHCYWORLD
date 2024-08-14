package com.lec.spring.repository;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.temporal.ChronoUnit;
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
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            throw new RuntimeException("No users found in the database.");
        }

        // Define the start and end dates
        LocalDateTime startDate = LocalDateTime.of(2024, Month.JANUARY, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.now();

        // Create 400 PaymentHistory objects with random data
        List<PaymentHistory> paymentHistories = IntStream.range(0, 400)
                .mapToObj(index -> {
                    int paymentAmount = (random.nextInt(10000) + 1) * 100; // Random payment amount (multiple of 10)

                    // Calculate date for the current index
                    LocalDateTime dateForIndex = generateDateForIndex(startDate, endDate, index);

                    return PaymentHistory.builder()
                            .user(users.get(random.nextInt(users.size()))) // Random user
                            .friendUser(random.nextBoolean() ? users.get(random.nextInt(users.size())) : null) // Random friend user or null
                            .merchantUid("mid" + (1000000 + random.nextInt(9000000))) // Random merchant UID
                            .impUid("imp" + (1000000 + random.nextInt(9000000))) // Random imp UID
                            .payment(paymentAmount) // Payment amount
                            .acornCnt((paymentAmount / 100) * 10) // Acorn count
                            .status("accept") // Set status
//                            .createAt(dateForIndex) // Set createAt date
                            .build();
                })
                .collect(Collectors.toList());

        // Save all PaymentHistory objects
        paymentHistoryRepository.saveAllAndFlush(paymentHistories);
    }

    private LocalDateTime generateDateForIndex(LocalDateTime startDate, LocalDateTime endDate, int index) {
        // Define the number of records per date increment
        int recordsPerDate = 3; // 3 records per date

        // Define the increment in days for each date change
        int daysIncrement = 2; // Change the date every 2 days

        // Calculate the number of days to add based on the index
        int dateOffset = (index / recordsPerDate) * daysIncrement;

        // Generate date by adding dateOffset to startDate
        LocalDateTime generatedDate = startDate.plusDays(dateOffset).withNano(0); // Remove nanoseconds

        // Ensure the generated date does not exceed endDate
        if (generatedDate.isAfter(endDate)) {
            generatedDate = endDate;
        }

        return generatedDate;
    }
}
