package com.lec.spring.repository;

import com.lec.spring.domain.Carts;
import com.lec.spring.domain.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartsRepository extends JpaRepository<Carts, Long> {
    List<Carts> findByUserAndCartsStatus(User user, String cartsStatus, Sort sort);
}
