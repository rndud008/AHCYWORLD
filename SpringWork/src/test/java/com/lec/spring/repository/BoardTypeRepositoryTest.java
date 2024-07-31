package com.lec.spring.repository;

import com.lec.spring.domain.BoardType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class BoardTypeRepositoryTest {

    @Autowired
    private BoardTypeRepository boardTypeRepository;

    @Test
    void test(){

        BoardType boardType = new BoardType();
        boardType.setName("게시판");

        boardTypeRepository.save(boardType);

        BoardType boardType1 = new BoardType();
        boardType1.setName("사진첩");

        boardTypeRepository.save(boardType1);

        BoardType boardType2 = new BoardType();
        boardType2.setName("동영상");

        boardTypeRepository.save(boardType2);

        boardTypeRepository.findAll().forEach(System.out::println);


    }

}