package com.lec.spring.repository;

import com.lec.spring.domain.Carts;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class CartsRepositoryTest {

    @Autowired
    CartsRepository cartsRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ItemRepository itemRepository;

    @Test
    void cartTest() {
        // Load existing users and items from repositories
//        List<User> users = userRepository.findAll();
//        List<Item> items = itemRepository.findAll();
//
//        if (users.isEmpty() || items.isEmpty()) {
//            fail("User or Item data is missing in the database.");
//            return;
//        }
//
//        // Define date range
//        LocalDateTime startDate = LocalDateTime.parse("2024-01-01T00:00:00");
//        LocalDateTime endDate = LocalDateTime.parse("2024-08-31T23:59:59");
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//
//        // Create a list of dates from start to end
//        List<LocalDateTime> dates = IntStream.rangeClosed(0, (int) startDate.until(endDate, java.time.temporal.ChronoUnit.DAYS))
//                .mapToObj(startDate::plusDays)
//                .collect(Collectors.toList());
//
//        Random random = new Random();
//
//        Set<String> uniqueUserItemPairs = new HashSet<>();
//        List<Carts> carts = new ArrayList<>();
//
//        for (LocalDateTime date : dates) {
//            User user;
//            Item item;
//
//            do {
//                user = users.get(random.nextInt(users.size()));
//                item = items.get(random.nextInt(items.size()));
//            } while (uniqueUserItemPairs.contains(user.getId() + "_" + item.getId()));
//
//            uniqueUserItemPairs.add(user.getId() + "_" + item.getId());
//
//            Carts cart = Carts.builder()
//                    .user(user)
//                    .item(item)
//                    .cartsStatus(random.nextBoolean() ? "Y" : "N")
//                    .createAt(date)
//                    .build();
//
//            carts.add(cart);
//
//            if (carts.size() >= 300) {
//                break;
//            }
//        }
        Carts carts = cartsRepository.findById(200L).orElse(null);

        carts.setCartsStatus("N");
        cartsRepository.save(carts);
    }
}
