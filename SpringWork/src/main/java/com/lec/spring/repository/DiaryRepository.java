package com.lec.spring.repository;

import com.lec.spring.domain.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findByHompyUserId(Long userId);
    // 달력 안의 내용 출력
    List<Diary> findByEventDate(LocalDate date);

    List<Diary> findByHompyId(Long hompyId);
}
