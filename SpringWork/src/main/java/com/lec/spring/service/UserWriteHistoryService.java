package com.lec.spring.service;

import com.lec.spring.domain.UserWriteHistroy;
import com.lec.spring.repository.UserWriteHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
public class UserWriteHistoryService {

    private final UserWriteHistoryRepository userWriteHistoryRepository;

    public UserWriteHistoryService(UserWriteHistoryRepository userWriteHistoryRepository) {
        this.userWriteHistoryRepository = userWriteHistoryRepository;
    }

    public List<UserWriteHistroy> list() {
        return userWriteHistoryRepository.findAll();
    }
}
