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
    void additem() {
        /*----------------------------------미니룸----------------------------------------*/
        Item item = Item.builder()
                .itemName("집앞마당미니룸")
                .itemType("스토리룸")
                .sourceName("집앞마당미니룸.jpg")
                .fileName("집앞마당미니룸.jpg")
                .price(200L)
                .status("visible")
                .build();
        itemRepository.saveAndFlush(item);

        Item item1 = Item.builder()
                .itemName("다과회미니룸")
                .itemType("스토리룸")
                .sourceName("다과회미니룸.jpg")
                .fileName("다과회미니룸.jpg")
                .price(200L)
                .status("visible")
                .build();
        itemRepository.saveAndFlush(item1);

        String[] miniroomarr = {"물래방아미니룸", "여행을떠나요미니룸", "꽃나무길미니룸", "디즈니미니룸", "우주여행미니룸",
                "단풍나무길미니룸", "꿈나라미니룸", "장미정원미니룸", "동물농장미니룸", "생제르망미니룸",
                "광교호수마을미니룸", "세진이의꿈나라미니룸", "신데렐라미니룸", "숲길미니룸", "겨울왕국미니룸"};
        for (int i = 2; i < 17; i++) {
            Item item2 = Item.builder()
                    .itemName(miniroomarr[i])
                    .itemType("스토리룸")
                    .sourceName(miniroomarr[i] + ".gif")
                    .fileName(miniroomarr[i] + ".gif")
                    .price(200L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(item2);
        }
        /*----------------------------------미니룸----------------------------------------*/


        /*----------------------------------미니미----------------------------------------*/
        String[] minimiarr = {"미니미니", "우산소녀", "나랑놀자", "렌고쿠", "네즈코", "루피",
                "추워잉", "기사단장", "유령", "신입사원", "새색시", "아줌마", "풍물놀이_북",
                "풍물놀이_꾕과리", "풍물놀이_태평소", "드라큘라", "도둑", "조로", "푸푸", "돌쇠",
                "학교가는중", "졸업생_남", "졸업생_여", "왕자님", "잼민이", "공쥬", "군인", "어응"};
        for (int i = 0; i < minimiarr.length; i++) {
            Item itme3 = Item.builder()
                    .itemName(minimiarr[i])
                    .itemType("미니미")
                    .sourceName(minimiarr[i] + ".png")
                    .fileName(minimiarr[i] + ".png")
                    .price(100L)
                    .status("visible")
                    .build();

            itemRepository.saveAndFlush(itme3);
        }
        /*----------------------------------미니미----------------------------------------*/

        /*----------------------------------스킨------------------------------------------*/

        String[] skinarr = {"새초롬마루스킨", "망그라진곰스킨", "마루스킨", "라이언스킨",
                "짱구스킨", "모험을떠나요스킨", "렌고쿠스킨", "토토로스킨", "블리치스킨",
                "포뇨스킨", "쿠로미스킨", "헬로키티스킨", "탄지로스킨", "당근포차코스킨"
                , "따봉포차코스킨", "기류스킨", "꽃구경스킨", "떡잎마을방범대스킨", "원피스스킨"};
        for (int i = 0; i < skinarr.length; i++) {
            Item itme4 = Item.builder()
                    .itemName(skinarr[i])
                    .itemType("스킨")
                    .sourceName(skinarr[i] + ".png")
                    .fileName(skinarr[i] + ".png")
                    .price(300L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(itme4);
        }
        /*----------------------------------스킨------------------------------------------*/

        /*----------------------------------폰트------------------------------------------*/
        String[] arrfont = {"Sunflower", "Noto Sans KR Variable", "Gothic A1", "Black Han Sans", "Noto Serif KR Variable",
                "Nanum Gothic Coding", "Nanum Brush Script", "Jua", "Nanum Pen Script", "Do Hyeon",
                "Nanum Myeongjo", "East Sea Dokdo", "Nanum Gothic", "Black And White Picture", "Gaegu",
                "Hi Melody", "Dokdo", "Gamja Flower", "Cute Font", "Gugi",
                "IBM Plex Sans KR", "Single Day", "Kirang Haerang", "Stylish", "Poor Story",
                "Yeon Sung", "Song Myung", "Hahmlet Variable", "Dongle", "Gowun Batang",
                "Gowun Dodum", "Bagel Fat One", "Diphylleia", "Moirai One", "Orbit",
                "Gasoek One", "Grandiflora One"
        };
        for (int i = 0; i < arrfont.length; i++) {
            Item item5 = Item.builder()
                    .itemName(arrfont[i] + "폰트")
                    .itemType("글꼴")
                    .sourceName(arrfont[i])
                    .fileName(arrfont[i])
                    .price(50L)
                    .status("visible")
                    .build();
            itemRepository.saveAndFlush(item5);
        }
        /*----------------------------------폰트------------------------------------------*/


    }

    @Test
    void creatuesr() {
        User user = User.builder()
                .username("jin".toUpperCase())
                .password(passwordEncoder.encode("1234"))
                .role("ROLE_MEMBER,ROLE_ADMIN")
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
    void addboardType() {
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