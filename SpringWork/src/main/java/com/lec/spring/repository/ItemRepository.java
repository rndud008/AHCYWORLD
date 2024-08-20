package com.lec.spring.repository;

import com.lec.spring.domain.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    Optional<List<Item>> findByItemTypeNotAndItemNameContainingIgnoreCaseAndStatus(String itemType,String itemName,String status);

    @Query("select i from Item  i where i.itemType = :itemType and i.status = :status and (i.fileName like %:keyword% or i.sourceName like %:keyword%)")
    Optional<List<Item>> findByItemTypeAndStatusAndItemNameOrSourceName(@Param("itemType") String itemType, @Param("status") String status, @Param("keyword") String keyword);

}
