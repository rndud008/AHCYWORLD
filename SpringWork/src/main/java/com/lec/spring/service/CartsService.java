package com.lec.spring.service;

import com.lec.spring.domain.Carts;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import com.lec.spring.repository.CartsRepository;
import com.lec.spring.repository.ItemRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

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
    public Carts addItem(String username, String itemname){
        User user = userRepository.findByUsername(username);
        Item item = itemRepository.findByItemName(itemname);

        Carts carts = Carts.builder()
                .user(user)
                .item(item)
                .cartsStatus("N")
                .build();

        return cartsRepository.saveAndFlush(carts);
    }
}
