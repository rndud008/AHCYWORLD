package com.lec.spring.controller;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.service.PaymentHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;

    public PaymentHistoryController(PaymentHistoryService paymentHistoryService) {
        this.paymentHistoryService = paymentHistoryService;
    }

    @PostMapping("/save")
    @CrossOrigin
    public ResponseEntity<?> save(@RequestBody PaymentHistory paymentHistory) {
        System.out.println(paymentHistory);
        return new ResponseEntity<>(paymentHistoryService.save(paymentHistory), HttpStatus.CREATED);
//        return new ResponseEntity<>(paymentHistory,HttpStatus.CREATED);
    }
}
