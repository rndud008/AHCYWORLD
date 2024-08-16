package com.lec.spring.repository;

import com.lec.spring.domain.Carts;
import com.lec.spring.domain.Item;
import com.lec.spring.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartsRepository extends JpaRepository<Carts, Long> {
    List<Carts> findByUserAndCartsStatus(User user, String cartsStatus, Sort sort);

    @Query("SELECT i " +
            "FROM Carts c " +
            "JOIN c.item i " +
            "WHERE c.cartsStatus = 'Y' " +
            "AND i.itemType = :itemType " +
            "GROUP BY i.id " +
            "ORDER BY count (c.id) DESC ")
    List<Item> findTopSellingItemsByType(@Param("itemType") String itemType, Pageable pageable);

    List<Carts> findByUserAndCartsStatus(User user, String cartsStatus);

    List<Carts> findByCartsStatus(String cartsStatus);
}
