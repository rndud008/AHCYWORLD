package com.lec.spring.repository;

import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    User findByName(String name);

    User findByUsername(String username);


}
