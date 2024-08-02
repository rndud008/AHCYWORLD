package com.lec.spring.repository;

import com.lec.spring.domain.PaymentHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory,Long> {
}
