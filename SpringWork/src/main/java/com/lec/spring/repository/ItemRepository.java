package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item,Long> {
    Page<Item> findByItemType(String type, PageRequest pageRequest);

    Item findByItemName(String itemname);

}
