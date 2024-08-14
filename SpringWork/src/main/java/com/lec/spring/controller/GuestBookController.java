package com.lec.spring.controller;

import com.lec.spring.config.PrincipalDetails;
import com.lec.spring.domain.GuestBook;
import com.lec.spring.domain.Hompy;
import com.lec.spring.service.GuestBookService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/cyworld/cy/guestbook")
public class GuestBookController {

    public final GuestBookService guestBookService;

    public GuestBookController(GuestBookService guestBookService) {
        this.guestBookService = guestBookService;
    }

    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody GuestBook guestBook) {
        // 일촌 관계인지 확인
        try {
            GuestBook savedGuestBook = guestBookService.save(guestBook);
            return new ResponseEntity<>(savedGuestBook, HttpStatus.OK);
        }catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/list/{hompyId}")
    public ResponseEntity<?> list(@PathVariable Long hompyId, @RequestParam String username,@RequestParam(required = false ,defaultValue = "null") String action){
        System.out.println("hompyId:" + hompyId);
        try {
            List<GuestBook> guestBooks = guestBookService.findByHompyAndVisibility(hompyId, username, action);
            System.out.println("guestBooks:" + guestBooks);
            return new ResponseEntity<>(guestBooks, HttpStatus.OK);
        }catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestParam String username) {
        try {
            int result = guestBookService.delete(id, username);
            if (result == 0){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(result, HttpStatus.OK);
        }catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/hide/{id}")
    public ResponseEntity<?> hide(@PathVariable Long id, @RequestParam String username) {
        try {
            GuestBook guestBook = guestBookService.hideGuestBook(id, username);
            return new ResponseEntity<>(guestBook, HttpStatus.OK);
        }catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/friends/check/{hompyId}")
    public ResponseEntity<?> friendsCheck(@PathVariable Long hompyId, @RequestParam String username) {
        try {
            boolean isFriend = guestBookService.isFriend(hompyId, username);
            return new ResponseEntity<>(Map.of("isFriend", isFriend), HttpStatus.OK);
        }catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/user/hompy/{userId}")
    public ResponseEntity<?> getUserHompy(@PathVariable Long userId){
        try {
            Hompy hompy = guestBookService.findHompyByUserId(userId);
            if (hompy == null){
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(hompy, HttpStatus.OK);
        }catch (IllegalArgumentException e){
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
