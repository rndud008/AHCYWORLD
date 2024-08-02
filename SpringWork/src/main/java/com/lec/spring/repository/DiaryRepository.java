package com.lec.spring.repository;

import com.lec.spring.domain.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    // 달력 안의 내용 출력
    Optional<Diary> findByEventDate(LocalDate date);
}
