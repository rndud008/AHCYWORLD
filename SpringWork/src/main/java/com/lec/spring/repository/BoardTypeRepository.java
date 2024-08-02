package com.lec.spring.repository;

import com.lec.spring.domain.BoardType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BoardTypeRepository extends JpaRepository<BoardType,Long> {
    Optional<BoardType> findByName(String name);
}
