package com.lec.spring.controller;

import com.lec.spring.service.CartsService;
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
    }

    @GetMapping("/list")
    @CrossOrigin
    public ResponseEntity<?> cartsItemList(@RequestParam Long id){
        return new ResponseEntity<>(cartsService.cartsList(id),HttpStatus.OK);
    }

    @GetMapping("/{id}/items")
    @CrossOrigin
    public ResponseEntity<?> userItemList(@PathVariable Long id){
        return new ResponseEntity<>(cartsService.userItemList(id),HttpStatus.OK);
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
    }

    @GetMapping("/itemcheck")
    @CrossOrigin
    public ResponseEntity<?> itemCheck(@RequestParam(defaultValue = "0") List<Long> itemList){
        System.out.println(itemList);
        return new ResponseEntity<>(cartsService.checkItemList(itemList),HttpStatus.OK);
//        return new ResponseEntity<>("tpwls",HttpStatus.OK);
    }

    @PostMapping("/payed/item")
    @CrossOrigin
    public ResponseEntity<?> payedItme(@RequestBody List<Long> itemList ,@RequestParam Long id, @RequestParam Long totalAcorn){

        return new ResponseEntity<>(cartsService.updateCarts(itemList,id,totalAcorn),HttpStatus.OK);
//        return new ResponseEntity<>("sejin",HttpStatus.OK);
    }

}
