package com.lec.spring.repository;

import com.lec.spring.domain.Message;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MessageRepositoryTest {

    @Autowired
    private MessageRepository messageRepository;

    @Test
    void messageTest() {
        List<Message> message = messageRepository.findAll();

        for(Message m : message) {
            m.setStatus("waiting");

            messageRepository.save(m);
        }

    }
}