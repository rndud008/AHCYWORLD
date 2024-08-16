package com.lec.spring.repository;

import com.lec.spring.domain.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
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
    @Autowired
    CartsRepository cartsRepository;
    @Autowired
    HompyRepository hompyRepository;
    @Autowired
    BoardTypeRepository boardTypeRepository;

    @Test
    void storyRoom() {
//        itemRepository.findByItemType("배경음악").forEach(System.out::println);
        Item item = Item.builder()
                .itemName("스토리룸1")
                .itemType("스토리룸")
                .sourceName("스토리룸1.jpg")
                .fileName("스토리룸1.jpg")
                .price(200L)
                .status("visible")
                .build();
        itemRepository.saveAndFlush(item);

        Item item1 = Item.builder()
                .itemName("스토리룸2")
                .itemType("스토리룸")
                .sourceName("스토리룸2.jpg")
                .fileName("스토리룸2.jpg")
                .price(200L)
                .status("visible")
                .build();
        itemRepository.saveAndFlush(item1);
        for (int i = 2; i < 17; i++) {
            Item item3 = Item.builder()
                    .itemName("마루" + (i + 1))
                    .itemType("스토리룸")
                    .sourceName("스토리룸" + (i + 1) + ".gif")
                    .fileName("스토리룸" + (i + 1) + ".gif")
                    .price(200L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(item3);
        }
    }

    @Test
    void minimi() {
        String[] minimiarr = {"미니미니", "우산소녀", "나랑놀자", "렌고쿠", "네즈코", "루피",
                "추워잉", "기사단장", "유령", "신입사원", "새색시", "아줌마", "풍물놀이_북",
                "풍물놀이_꾕과리", "풍물놀이_태평소", "드라큘라", "도둑", "조로", "푸푸", "돌쇠",
                "학교가는중", "졸업생_남", "졸업생_여", "왕자님", "잼민이", "공쥬", "군인", "어응"};

        for (int i = 0; i < minimiarr.length; i++) {
            Item itme4 = Item.builder()
                    .itemName(minimiarr[i])
                    .itemType("미니미")
                    .sourceName(minimiarr[i] + ".png")
                    .fileName(minimiarr[i] + ".png")
                    .price(100L)
                    .status("visible")
                    .build();

            itemRepository.saveAndFlush(itme4);

        }

        String[] skinarr = {"새초롬마루스킨", "망그라진곰스킨", "마루스킨", "라이언스킨",
                "짱구스킨", "모험을떠나요스킨", "렌고쿠스킨", "토토로스킨", "블리치스킨",
                "포뇨스킨", "쿠로미스킨", "헬로키티스킨", "탄지로스킨", "당근포차코스킨"
                , "따봉포차코스킨", "기류스킨","꽃구경스킨","떡잎마을방범대스킨","원피스스킨"};



        for (int i = 0; i < skinarr.length; i++) {
            Item itme5 = Item.builder()
                    .itemName(skinarr[i])
                    .itemType("스킨")
                    .sourceName(skinarr[i] + ".png")
                    .fileName(skinarr[i] + ".png")
                    .price(300L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(itme5);
        }
    }

    @Test
    void updateSkin(){
        String[] skinarr = {"모험을떠나요스킨","꽃구경스킨","떡잎마을방범대스킨","원피스스킨"};



        for (int i = 0; i < skinarr.length; i++) {
            Item itme5 = Item.builder()
                    .itemName(skinarr[i])
                    .itemType("스킨")
                    .sourceName(skinarr[i] + ".png")
                    .fileName(skinarr[i] + ".png")
                    .price(300L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(itme5);
        }
    }


    @Test
    void font() {
        Item itme = Item.builder()
                .itemName("폰트1")
                .itemType("글꼴")
                .sourceName("Nanum Pen Script")
                .fileName("Nanum Pen Script")
                .price(50L)
                .status("visible")
                .build();

        Item itme1 = Item.builder()
                .itemName("폰트2")
                .itemType("글꼴")
                .sourceName("Pacifico")
                .fileName("Pacifico")
                .price(50L)
                .status("visible")
                .build();

        Item itme2 = Item.builder()
                .itemName("폰트3")
                .itemType("글꼴")
                .sourceName("Permanent Marker")
                .fileName("Permanent Marker")
                .price(50L)
                .status("visible")
                .build();

        Item itme3 = Item.builder()
                .itemName("폰트4")
                .itemType("글꼴")
                .sourceName("Source Code Pro")
                .fileName("Source Code Pro")
                .price(50L)
                .status("visible")
                .build();

        itemRepository.saveAllAndFlush(List.of(itme, itme1, itme2, itme3));
    }

    @Test
    void list() {
        itemRepository.findAll().forEach(System.out::println);
    }

    @Test
    void user() {
        User user = userRepository.findByUsername("jin");

//         user.setPassword(passwordEncoder.encode("1234"));
        user.setAcorn(10000L);
        userRepository.save(user);
    }

    @Test
    void createuser() {
        User user = User.builder()
                .username("jin".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER")
                .birthDay(LocalDate.now())
                .email("jjj@mail.com")
                .gender("MALE")
                .name("진")
                .acorn(30000L)
                .build();
        user = userRepository.saveAndFlush(user);

        Hompy hompy = Hompy.builder()
                .user(user)
                .menuColor("#147DAF,#FFF,#147DAF")
                .menuStatus("visible,visible,visible,visible")
                .profilePicture("/upload/default_profile.png")
                .title("진님의 미니홈피")
                .build();

        hompyRepository.saveAndFlush(hompy);
    }


    @Test
    void path() {
        Path uploadDir = Paths.get("../ahcyworld-app/public", "image").toAbsolutePath();
        if (Files.isDirectory(uploadDir)) {
            try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(uploadDir)) {
                System.out.println("Contents of directory " + uploadDir + ":");
                for (Path path : directoryStream) {
                    System.out.println(path.getFileName());
                }
            } catch (IOException e) {
                System.err.println("Error reading directory: " + e.getMessage());
            }
        } else {
            System.out.println(uploadDir + " is not a directory.");
        }
    }

    @Test
    void boardType(){
        BoardType boardType = new BoardType();
        boardType.setName("게시판");

        boardTypeRepository.save(boardType);

        BoardType boardType1 = new BoardType();
        boardType1.setName("사진첩");

        boardTypeRepository.save(boardType1);

        BoardType boardType2 = new BoardType();
        boardType2.setName("동영상");

        boardTypeRepository.save(boardType2);
    }

}