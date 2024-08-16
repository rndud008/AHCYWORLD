package com.lec.spring.service;

import com.lec.spring.domain.Message;
import com.lec.spring.domain.User;
import com.lec.spring.repository.MessageRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserService userService, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public Message save(String title, String message, Long senderId, Long receiverId) {

        User sender = userRepository.findById(senderId).orElse(null);
        User receiver = userRepository.findById(receiverId).orElse(null);

        Message newMessage = Message.builder()
                .title(title)
                .message(message)
                .sender(sender)
                .receiver(receiver)
                .status("waiting")
                .build();
        return messageRepository.save(newMessage);
    }

    public List<Message> myMessages(Long userId) {
        List<Message> messageList = messageRepository.findAll();
        List<Message> myMessages = new ArrayList<>();

        for (Message message : messageList) {
            if (message.getReceiver().getId().equals(userId) && message.getStatus().equals("waiting")) {
                myMessages.add(message);
            }
        }
//        System.out.println("전체 메세지 리스트"+messageList);
//        System.out.println("내 메세지 리스트" + myMessages);
        return myMessages;
    }

    public Message read(Long MessageId) {

        Message message = messageRepository.findById(MessageId).orElse(null);

        message.setStatus("read");
        return messageRepository.save(message);
    }
}
