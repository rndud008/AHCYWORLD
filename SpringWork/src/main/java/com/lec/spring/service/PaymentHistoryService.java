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
        User user;
        if(paymentHistory.getFriendUser().getId() == null){
            user = userRepository.findById(paymentHistory.getUser().getId()).orElse(null);
            paymentHistory.setFriendUser(null);
            paymentHistory.setStatus("accept");
            user.setAcorn(user.getAcorn() + paymentHistory.getAcornCnt());
        }else{
            user = userRepository.findById(paymentHistory.getFriendUser().getId()).orElse(null);
            paymentHistory.setStatus("waiting");
        }
            userRepository.saveAndFlush(user);
            return paymentHistoryRepository.saveAndFlush(paymentHistory);

    }

    public List<PaymentHistory> list(String username) {
        return null;
    }

    public List<PaymentHistory> findAll() {

        List<PaymentHistory> paymentHistories = paymentHistoryRepository.findAll();
//        System.out.println("paymentHistories: " + paymentHistories);

        return paymentHistories;
    }

    public List<PaymentHistory> waitingList(Long id){
            User FriendUser = userRepository.findById(id).orElse(null);
        return paymentHistoryRepository.findByFriendUserAndStatus(FriendUser,"waiting");
    }

    public PaymentHistory giftsuccess(Long id){
        PaymentHistory paymentHistory = paymentHistoryRepository.findById(id).orElse(null);
        User user = userRepository.findById(paymentHistory.getFriendUser().getId()).orElse(null);

        user.setAcorn(user.getAcorn() + paymentHistory.getAcornCnt());
        userRepository.saveAndFlush(user);
        paymentHistory.setStatus("accept");
        return paymentHistoryRepository.saveAndFlush(paymentHistory);

    }

}
