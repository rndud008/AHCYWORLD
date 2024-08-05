package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Long> {
    List<Item>findByItemType(String type);
}
