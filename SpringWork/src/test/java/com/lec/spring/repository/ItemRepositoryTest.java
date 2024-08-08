package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ItemRepositoryTest {

    @Autowired
    ItemRepository itemRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Test
    void storyRoom(){
//        itemRepository.findByItemType("배경음악").forEach(System.out::println);
        Item item = Item.builder()
                .itemName("마루1")
                .itemType("스토리룸")
                .sourceName("스토리룸1.gif")
                .fileName("스토리룸1.gif")
                .price(200L)
                .status("visible")
                .build();
        itemRepository.saveAndFlush(item);
        for(int i =1 ; i<17; i++){
            Item item1 = Item.builder()
                    .itemName("마루"+(i+1))
                    .itemType("스토리룸")
                    .sourceName("스토리룸"+(i+1)+".gif")
                    .fileName("스토리룸"+(i+1)+".gif")
                    .price(200L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(item1);
        }
    }
    @Test
    void minimi(){
        for(int i =0; i<18; i++){
            Item itme = Item.builder()
                    .itemName("미니미"+(i+1))
                    .itemType("미니미")
                    .sourceName("minimi"+(i+1)+".png")
                    .fileName("minimi"+(i+1)+".png")
                    .price(10L)
                    .status("visible")
                    .build();

            itemRepository.saveAndFlush(itme);

        }
    }

    @Test
    void font(){
        Item itme = Item.builder()
                .itemName("폰트1")
                .itemType("글꼴")
                .sourceName("Nanum Pen Script")
                .fileName("Nanum Pen Script")
                .price(50L)
                .status("visible")
                .build();

        Item itme1 = Item.builder()
                .itemName("폰트1")
                .itemType("글꼴")
                .sourceName("Pacifico")
                .fileName("Pacifico")
                .price(50L)
                .status("visible")
                .build();

        Item itme2 = Item.builder()
                .itemName("폰트1")
                .itemType("글꼴")
                .sourceName("Permanent Marker")
                .fileName("Permanent Marker")
                .price(50L)
                .status("visible")
                .build();

        Item itme3 = Item.builder()
                .itemName("폰트1")
                .itemType("글꼴")
                .sourceName("Source Code Pro")
                .fileName("Source Code Pro")
                .price(50L)
                .status("visible")
                .build();

        itemRepository.saveAllAndFlush(List.of(itme,itme1,itme2,itme3));
    }

    @Test
    void skin(){
        String[] name = {"skin","가을라이언","라이언","렌고쿠","블리치","원피스","짱구","쿠로미","포뇨","포치코","포치코2","헬로키티","마루"};
        for(int i = 0; i< name.length; i++){
            Item itme = Item.builder()
                    .itemName(name[i])
                    .itemType("스킨")
                    .sourceName(name[i]+".png")
                    .fileName(name[i]+".png")
                    .price(100L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(itme);
        }


    }
    @Test
    void list(){
        itemRepository.findAll().forEach(System.out::println);
    }

    @Test
    void user(){
         User user = userRepository.findByUsername("sejin");

         user.setPassword(passwordEncoder.encode("1234"));
         userRepository.save(user);
    }

}