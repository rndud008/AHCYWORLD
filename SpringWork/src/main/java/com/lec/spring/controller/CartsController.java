package com.lec.spring.controller;

import com.lec.spring.service.CartsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartsController {

    public final CartsService cartsService;

    public CartsController(CartsService cartsService) {
        this.cartsService = cartsService;
    }

    @PostMapping("/additem")
    @CrossOrigin
    public ResponseEntity<?> addItem(@RequestParam String username, @RequestParam String itemname){
//        return new ResponseEntity<>(cartsService.addItem(username,itemname), HttpStatus.CREATED);
        System.out.println("다시한번 여기 오냐?");
        return new ResponseEntity<>("세진",HttpStatus.CREATED);
    }
}
