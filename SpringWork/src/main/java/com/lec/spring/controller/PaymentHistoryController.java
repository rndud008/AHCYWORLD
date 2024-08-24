package com.lec.spring.controller;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.domain.User;
import com.lec.spring.service.PaymentHistoryService;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/list")
    @CrossOrigin
    public List<PaymentHistory> list() {

        return paymentHistoryService.findAll();
    }

    @GetMapping("/acorn/gift/{id}")
    @CrossOrigin
    public ResponseEntity<?> gift(@PathVariable Long id){
        return new ResponseEntity<>(paymentHistoryService.waitingList(id),HttpStatus.OK);
    }

    @PostMapping("/acorn/gift/success")
    @CrossOrigin
    public ResponseEntity<?> giftsucess(@RequestParam Long id){
        return new ResponseEntity<>(paymentHistoryService.giftsuccess(id),HttpStatus.OK);
    }


}
