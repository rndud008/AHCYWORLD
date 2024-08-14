package com.lec.spring.controller;

import com.lec.spring.domain.Item;
import com.lec.spring.service.ItemService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Struct;

@RestController
@RequestMapping("/item")
public class ItemController {

    public final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/musicsave")
    @CrossOrigin
    public ResponseEntity<?> musicsave(@RequestBody Item item) {
        return new ResponseEntity<>(itemService.update(item), HttpStatus.CREATED);
    }

    @GetMapping("/{type}")
    @CrossOrigin
    public ResponseEntity<?> visibleItemList(
            @PathVariable String type
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "") String searchItem
            , HttpServletRequest request) {
        String url = request.getRequestURI();
        System.out.println("주소:  " + url);
        return new ResponseEntity<>(itemService.list(page, url, type, searchItem), HttpStatus.OK);
    }

    @GetMapping("/admin/{type}")
    @CrossOrigin
    public ResponseEntity<?> allItemList(
            @PathVariable String type
            , @RequestParam(defaultValue = "0") Integer page
            , @RequestParam(defaultValue = "") String searchItem
            , HttpServletRequest request) {
        String url = request.getRequestURI();
        System.out.println("주소:  " + url);
        return new ResponseEntity<>(itemService.list(page, url, type, searchItem), HttpStatus.OK);
    }

    @PostMapping("/admin/update")
    @CrossOrigin
    public ResponseEntity<?> updateItem(@RequestBody Item item) {
        return new ResponseEntity<>(itemService.save(item), HttpStatus.OK);
    }


}
