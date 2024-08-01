package com.lec.spring.service;

import com.lec.spring.repository.EmailAuthenticationRepository;
import org.springframework.stereotype.Service;

@Service
public class EmailAuthenticationService {

    private final EmailAuthenticationRepository emailAuthenticationRepository;

    public EmailAuthenticationService(EmailAuthenticationRepository emailAuthenticationRepository) {
        this.emailAuthenticationRepository = emailAuthenticationRepository;
    }
}
