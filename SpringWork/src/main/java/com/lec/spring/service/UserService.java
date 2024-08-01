package com.lec.spring.service;

import com.lec.spring.domain.User;
import com.lec.spring.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import java.time.LocalDate;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 특정 ID로 User 조회
    public Optional<User> findByUserId(Long id) {
        return userRepository.findById(id);
    }

    public User join(User user) {
        String username = user.getUsername();
        String password = user.getPassword();
        String email = user.getEmail();
        String name = user.getName();
        String gender = user.getGender();
        LocalDate birthDay = user.getBirthDay();

        if (userRepository.existsByUsername(username)) {
            return null;
        }

        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(email);
        user.setName(name);
        user.setGender(gender);
        user.setBirthDay(birthDay);
        user.setRole("MEMBER");
        return userRepository.saveAndFlush(user);
    }

    public User findByName(String name) {
        return userRepository.findByName(name);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username.toUpperCase());
    }

}
