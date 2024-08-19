package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findByItemTypeAndStatus(String type, String status, PageRequest pageRequest);

    Page<Item> findByItemType(String type, PageRequest pageRequest);

    Page<Item> findByStatus(String status, PageRequest pageRequest);

    Item findByItemName(String itemname);

    Page<Item> findByItemNameContaining(String itemname, PageRequest pageRequest);

    Page<Item> findByItemNameContainingAndAndItemType(String itemname, String type, PageRequest pageRequest);

    boolean existsItemByItemName(String itemName);

    Optional<List<Item>> findByItemNameContainingIgnoreCaseAndStatus(String itemName,String status);

}
