package com.lec.spring.service;

import com.lec.spring.domain.Carts;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import com.lec.spring.repository.CartsRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.*;

@Service
public class CartsService {
    public final CartsRepository cartsRepository;
    public final ItemRepository itemRepository;

    public final UserRepository userRepository;

    public CartsService(CartsRepository cartsRepository, ItemRepository itemRepository, UserRepository userRepository) {
        this.cartsRepository = cartsRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Carts addItem(String username, String itemname) {
        User user = userRepository.findByUsername(username);
        Item item = itemRepository.findByItemName(itemname);

        Carts carts = Carts.builder()
                .user(user)
                .item(item)
                .cartsStatus("N")
                .build();

        return cartsRepository.saveAndFlush(carts);
    }

    @Transactional
    public List<Carts> cartsList(Long id) {

        User user = userRepository.findById(id).orElse(null);
        Sort sort = Sort.by(Sort.Order.desc("id"));

        return cartsRepository.findByUserAndCartsStatus(user, "N", sort);
    }

    @Transactional
    public List<Carts> userItemList(Long id) {
        User user = userRepository.findById(id).orElse(null);
        Sort sort = Sort.by(Sort.Order.desc("id"));

        return cartsRepository.findByUserAndCartsStatus(user, "Y", sort);
    }

    @Transactional
    public List<Carts> userCartItems(Long id) {
        User user = userRepository.findById(id).orElse(null);
        Sort sort = Sort.by(Sort.Order.desc("id"));

        return cartsRepository.findByUserAndCartsStatus(user, "N", sort);
    }

    @Transactional
    public int deleteCartsItem(Long id) {
        Carts carts = cartsRepository.findById(id).orElse(null);
        if (carts == null) {
            return 0;
        } else {
            cartsRepository.delete(carts);
            return 1;
        }
    }

    @Transactional
    public int deleteAll(List<Long> deleteList) {

        List<Carts> deleteItems = cartsRepository.findAllById(deleteList);
        if (deleteItems == null) {
            return 0;
        } else {
            cartsRepository.deleteAll(deleteItems);
            return 1;
        }
    }

    @Transactional
    public List<Carts> checkItemList(List<Long> itemList) {
        return cartsRepository.findAllById(itemList);
    }

    @Transactional
    public List<Carts> updateCarts(List<Long> itemList, Long id, Long totalAcorn) {
        List<Carts> updateItems = cartsRepository.findAllById(itemList);
        User user = userRepository.findById(id).orElse(null);
        if (updateItems == null) {
            return null;
        } else {
            user.setAcorn(user.getAcorn() - totalAcorn);

            userRepository.saveAndFlush(user);

            updateItems.forEach(item -> {
                item.setCartsStatus("Y");
            });
            return cartsRepository.saveAllAndFlush(updateItems);
        }
    }

    // Top5 출력
    public Map<String, List<Item>> getTopSellingItems(){
        Map<String, List<Item>> topSellingItems = new HashMap<>();
        List<String> itemTypes = List.of("배경음악", "글꼴", "스킨", "미니미", "스토리룸");

        for (String itemType : itemTypes) {
            Pageable topFive = PageRequest.of(0, 5);
            List<Item> items = cartsRepository.findTopSellingItemsByType(itemType, topFive);
            topSellingItems.put(itemType, items);
        }
        return topSellingItems;
    }

    // 결제 내역 출력
    @Transactional(readOnly = true)
    public List<Carts> getPaymentHistory(Long id) {
        User user = new User();
        user.setId(id);
        return cartsRepository.findByUserAndCartsStatusOrderByCreateAtDesc(user, "Y");
    }

}
