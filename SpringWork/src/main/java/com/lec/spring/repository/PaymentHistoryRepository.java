package com.lec.spring.repository;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory,Long> {
    List<PaymentHistory> findByFriendUserAndStatus(User FriendUser, String status);
}
