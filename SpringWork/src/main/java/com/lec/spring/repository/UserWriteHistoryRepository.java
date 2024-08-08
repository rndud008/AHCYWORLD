package com.lec.spring.repository;

import com.lec.spring.domain.UserWriteHistroy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserWriteHistoryRepository extends JpaRepository<UserWriteHistroy, Long> {
}
