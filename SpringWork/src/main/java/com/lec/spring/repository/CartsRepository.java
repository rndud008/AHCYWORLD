package com.lec.spring.repository;

import com.lec.spring.domain.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartsRepository extends JpaRepository<Carts, Long> {

}
