package com.lec.spring.repository;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HompyRepository extends JpaRepository<Hompy, Long> {
    // User를 기준으로 Hompy 엔티티를 찾는 메서드
    Hompy findByUser(User user);
}
