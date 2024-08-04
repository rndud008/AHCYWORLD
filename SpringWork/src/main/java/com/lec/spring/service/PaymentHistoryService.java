package com.lec.spring.service;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.domain.User;
import com.lec.spring.repository.PaymentHistoryRepository;
import com.lec.spring.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentHistoryService {
    private final PaymentHistoryRepository paymentHistoryRepository;
    private final UserRepository userRepository;

    public PaymentHistoryService(PaymentHistoryRepository paymentHistoryRepository, UserRepository userRepository, UserRepository userRepository1) {
        this.paymentHistoryRepository = paymentHistoryRepository;
        this.userRepository = userRepository1;
    }

    @Transactional
    public PaymentHistory save(PaymentHistory paymentHistory) {
        User user = userRepository.findById(paymentHistory.getUser().getId()).orElse(null);
        user.setAcorn(user.getAcorn() + paymentHistory.getAcornCnt());
        userRepository.saveAndFlush(user);
        return paymentHistoryRepository.saveAndFlush(paymentHistory);
    }

    public List<PaymentHistory> list(String username) {
        return null;
    }
}
