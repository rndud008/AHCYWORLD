package com.lec.spring.controller;

import com.lec.spring.domain.PaymentHistory;
import com.lec.spring.repository.PaymentHistoryRepository;
import com.lec.spring.service.PaymentHistoryService;
import com.lec.spring.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentHistoryController {

    private final PaymentHistoryService paymentHistoryService;
    private final UserService userService;

    public PaymentHistoryController(PaymentHistoryService paymentHistoryService, UserService userService) {
        this.paymentHistoryService = paymentHistoryService;
        this.userService = userService;
    }

    @GetMapping("/{username}")
    @CrossOrigin
    public ResponseEntity<?> loginUser(@PathVariable String username){
        return new ResponseEntity<>(userService.findByUsername(username), HttpStatus.OK);
    }

    @PostMapping("/save")
    @CrossOrigin
    public ResponseEntity<?> save(@RequestBody PaymentHistory paymentHistory){
        return new ResponseEntity<>(paymentHistoryService.save(paymentHistory),HttpStatus.CREATED);
    }


}
