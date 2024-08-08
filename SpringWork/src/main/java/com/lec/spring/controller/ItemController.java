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

    @PostMapping("/save")
    @CrossOrigin
    public ResponseEntity<?> save( @RequestBody Item item){
        return new ResponseEntity<>(itemService.save(item), HttpStatus.CREATED);
    }

    @GetMapping("/{type}")
    @CrossOrigin
    public ResponseEntity<?> music(
            @PathVariable String type
            , @RequestParam(defaultValue = "0") Integer page
            , HttpServletRequest request){
        String url = request.getRequestURI();
        return new ResponseEntity<>(itemService.list(page,url,type), HttpStatus.OK);
    }


}
