package com.lec.spring.repository;

import com.lec.spring.domain.Hompy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HompyRepository extends JpaRepository<Hompy, Long> {
}
