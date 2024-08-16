package com.lec.spring.controller;

import com.lec.spring.service.ItemService;
import com.lec.spring.service.SearchService;
import com.lec.spring.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class SearchController {

    private final UserService userService;
    private final ItemService itemService;

    private final SearchService searchService;

    public SearchController(UserService userService, ItemService itemService, SearchService searchService) {
        this.userService = userService;
        this.itemService = itemService;
        this.searchService = searchService;
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchList(@RequestParam String search,@RequestParam String action) {

        try {
            if (action.equals("all")) {
                return new ResponseEntity<>(searchService.searchAllList(search), HttpStatus.OK);
            } else if (action.equals("people")) {
                return new ResponseEntity<>(searchService.searchUserList(search), HttpStatus.OK);
            } else if (action.equals("item")) {
                return new ResponseEntity<>(searchService.searchItemList(search), HttpStatus.OK);
            } else {
                return new ResponseEntity<>("잘못된 요청 입니다.", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }

    }


}
