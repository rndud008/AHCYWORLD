package com.lec.spring.controller;

import com.lec.spring.service.CartsService;
import com.sun.tools.jconsole.JConsoleContext;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        return new ResponseEntity<>(cartsService.addItem(username,itemname), HttpStatus.CREATED);
//        return new ResponseEntity<>(username+"이랑"+itemname,HttpStatus.CREATED);
    }

    @GetMapping("/list")
    @CrossOrigin
    public ResponseEntity<?> cartsItemList(@RequestParam Long id){
        return new ResponseEntity<>(cartsService.cartsList(id),HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    @CrossOrigin
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id){
        return new ResponseEntity<>(cartsService.deleteCartsItem(id),HttpStatus.OK);
    }

    @DeleteMapping("/delete/all")
    @CrossOrigin
    public ResponseEntity<?> deleteAll(@RequestBody List<Long> deleteList){
        System.out.println(deleteList);
        return new ResponseEntity<>(cartsService.deleteAll(deleteList),HttpStatus.OK);
//        return new ResponseEntity<>(deleteList,HttpStatus.OK);
    }
}
