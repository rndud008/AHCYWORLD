package com.lec.spring.repository;

import com.lec.spring.domain.EmailAuthentication;
import com.lec.spring.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailAuthenticationRepository extends JpaRepository<EmailAuthentication,Long> {
}
