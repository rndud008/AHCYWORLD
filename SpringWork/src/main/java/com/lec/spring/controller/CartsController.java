package com.lec.spring.controller;

import com.lec.spring.domain.Carts;
import com.lec.spring.service.CartsService;
import com.lec.spring.service.PaymentHistoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartsController {

    public final CartsService cartsService;
    private final PaymentHistoryService paymentHistoryService;

    public CartsController(CartsService cartsService, PaymentHistoryService paymentHistoryService) {
        this.cartsService = cartsService;
        this.paymentHistoryService = paymentHistoryService;
    }

    @PostMapping("/additem")
    @CrossOrigin
    public ResponseEntity<?> addItem(@RequestParam String username, @RequestParam String itemname) {
        return new ResponseEntity<>(cartsService.addItem(username, itemname), HttpStatus.CREATED);
    }

    @GetMapping("/list")
    @CrossOrigin
    public ResponseEntity<?> cartsItemList(@RequestParam Long id) {
        return new ResponseEntity<>(cartsService.cartsList(id), HttpStatus.OK);
    }

    @GetMapping("/sold-list")
    public List<Carts> cartsSoldList(){
        return cartsService.soldItemList();
    }

    @GetMapping("/{id}/items")
    @CrossOrigin
    public ResponseEntity<?> userItemList(@PathVariable Long id) {
        return new ResponseEntity<>(cartsService.userItemList(id), HttpStatus.OK);
    }

    @GetMapping("/{id}/cartitems")
    @CrossOrigin
    public ResponseEntity<?> cartitems(@PathVariable Long id) {
        return new ResponseEntity<>(cartsService.userCartItems(id), HttpStatus.OK);
    }

    @DeleteMapping("delete/{id}")
    @CrossOrigin
    public ResponseEntity<?> deleteCartItem(@PathVariable Long id) {
        return new ResponseEntity<>(cartsService.deleteCartsItem(id), HttpStatus.OK);
    }

    @DeleteMapping("/delete/all")
    @CrossOrigin
    public ResponseEntity<?> deleteAll(@RequestBody List<Long> deleteList) {
        System.out.println(deleteList);
        return new ResponseEntity<>(cartsService.deleteAll(deleteList), HttpStatus.OK);
    }

    @GetMapping("/itemcheck")
    @CrossOrigin
    public ResponseEntity<?> itemCheck(@RequestParam(defaultValue = "0") List<Long> itemList) {
        System.out.println(itemList);
        return new ResponseEntity<>(cartsService.checkItemList(itemList), HttpStatus.OK);
//        return new ResponseEntity<>("tpwls",HttpStatus.OK);
    }

    @PostMapping("/payed/item")
    @CrossOrigin
    public ResponseEntity<?> payedItme(@RequestBody List<Long> itemList, @RequestParam Long id, @RequestParam Long totalAcorn) {

        return new ResponseEntity<>(cartsService.updateCarts(itemList, id, totalAcorn), HttpStatus.OK);
//        return new ResponseEntity<>("sejin",HttpStatus.OK);
    }

    @GetMapping("/top-selling-items")
    public ResponseEntity<?> getTopSellingItems() {
        return ResponseEntity.ok(cartsService.getTopSellingItems());
    }

    @GetMapping("/history")
    public List<Carts> getHistory(@RequestParam Long id) {
        return cartsService.getPaymentHistory(id);
    }
}
