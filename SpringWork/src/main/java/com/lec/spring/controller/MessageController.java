package com.lec.spring.controller;

import com.lec.spring.domain.Message;
import com.lec.spring.domain.User;
import com.lec.spring.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessageController {

    public final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestParam String title
            , @RequestParam String message, @RequestParam Long senderId, @RequestParam Long receiverId) {
        return new ResponseEntity<>(messageService.save(title, message, senderId, receiverId), HttpStatus.CREATED);
    }

    @GetMapping("/mymessage")
    public List<Message> getMyMessage(@RequestParam Long userId) {
        System.out.println("유저아이디: " + userId);
        return messageService.myMessages(userId);
    }

    @PostMapping("/read")
    public ResponseEntity<?> read(@RequestParam Long messageId) {
        return new ResponseEntity<>(messageService.read(messageId), HttpStatus.OK);
    }

}
