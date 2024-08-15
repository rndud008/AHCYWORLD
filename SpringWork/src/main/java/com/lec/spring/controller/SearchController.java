package com.lec.spring.controller;

import com.lec.spring.service.ItemService;
import com.lec.spring.service.SearchService;
import com.lec.spring.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final UserService userService;
    private final ItemService itemService;

    private final SearchService searchService;

    public SearchController(UserService userService, ItemService itemService, SearchService searchService) {
        this.userService = userService;
        this.itemService = itemService;
        this.searchService = searchService;
    }

    @GetMapping("/peoplelist")
    public ResponseEntity<?> searchList(String search){

        try{
            return new ResponseEntity<>(searchService.searchUserList(search), HttpStatus.OK);

        }catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }

    }




}
