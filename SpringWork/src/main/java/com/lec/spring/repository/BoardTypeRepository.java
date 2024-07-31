package com.lec.spring.repository;

import com.lec.spring.domain.BoardType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardTypeRepository extends JpaRepository<BoardType,Long> {
}
