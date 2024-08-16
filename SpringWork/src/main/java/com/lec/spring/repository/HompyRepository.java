package com.lec.spring.repository;

import com.lec.spring.domain.Hompy;
import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface HompyRepository extends JpaRepository<Hompy, Long> {
    // User를 기준으로 Hompy 엔티티를 찾는 메서드
    Hompy findByUser(User user);
    Optional<List<Hompy>> findByUserNameContainingIgnoreCase(String name);
}
