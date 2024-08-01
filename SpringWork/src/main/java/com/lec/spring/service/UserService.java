package com.lec.spring.service;

import com.lec.spring.domain.User;
import com.lec.spring.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 특정 ID로 User 조회
    public Optional<User> findByUserId(Long id) {
        return userRepository.findById(id);
    }
}
