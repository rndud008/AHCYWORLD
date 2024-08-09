package com.lec.spring.repository;

import com.lec.spring.domain.GuestBook;
import com.lec.spring.domain.Hompy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuestBookRepository extends JpaRepository<GuestBook, Long> {
    List<GuestBook> findByHompy(Hompy hompy);
    List<GuestBook> findByHompyId(Long hompyId);
}
