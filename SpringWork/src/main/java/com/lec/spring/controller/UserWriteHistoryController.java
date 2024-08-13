package com.lec.spring.controller;

import com.lec.spring.domain.UserWriteHistroy;
import com.lec.spring.service.UserWriteHistoryService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/userwritehistory")
public class UserWriteHistoryController {

    private final UserWriteHistoryService userWriteHistoryService;

    public UserWriteHistoryController(UserWriteHistoryService userWriteHistoryService) {
        this.userWriteHistoryService = userWriteHistoryService;
    }

    @GetMapping("/list")
    public List<UserWriteHistroy> list(){
        return userWriteHistoryService.list();
    }
}
