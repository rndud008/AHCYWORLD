package com.lec.spring.service;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.repository.PaymentHistoryRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentHistoryService {
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final UserRepository userRepository;

    public PaymentHistoryService(PaymentHistoryRepository paymentHistoryRepository, UserRepository userRepository) {
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.userRepository = userRepository;
    }

    public PaymentHistory save(PaymentHistory paymentHistory){
        return paymentHistoryRepository.save(paymentHistory);
    }

    public List<PaymentHistory> list(String username){
        return  null;
    }





}
